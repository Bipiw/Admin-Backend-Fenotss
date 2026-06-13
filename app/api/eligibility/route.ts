import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role, ELIGIBILITY_THRESHOLDS, EligibilityStatus } from "@/lib/constants"
import { logAction } from "@/lib/audit"

// ─── Compute eligibility for one member ──────────────────────────────────────
async function computeEligibility(profileId: string) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90) // 90 days window

    // Load dynamic thresholds from SystemSetting, fallback to constants
    const settings = await prisma.systemSetting.findMany()
    const thresholds: {
        MIN_ATTENDANCE_RATE: number;
        MIN_FINANCE_RATE: number;
        MIN_ACADEMIC_SCORE: number;
    } = {
        MIN_ATTENDANCE_RATE: ELIGIBILITY_THRESHOLDS.MIN_ATTENDANCE_RATE,
        MIN_FINANCE_RATE: ELIGIBILITY_THRESHOLDS.MIN_FINANCE_RATE,
        MIN_ACADEMIC_SCORE: ELIGIBILITY_THRESHOLDS.MIN_ACADEMIC_SCORE,
    }
    for (const s of settings) {
        if (s.key === "MIN_ATTENDANCE_RATE") thresholds.MIN_ATTENDANCE_RATE = parseFloat(s.value)
        if (s.key === "MIN_FINANCE_RATE") thresholds.MIN_FINANCE_RATE = parseFloat(s.value)
        if (s.key === "MIN_ACADEMIC_SCORE") thresholds.MIN_ACADEMIC_SCORE = parseFloat(s.value)
    }

    // Attendance rate
    const [presentCount, totalAttendance] = await Promise.all([
        prisma.attendance.count({ where: { memberId: profileId, status: "PRESENT", date: { gte: thirtyDaysAgo } } }),
        prisma.attendance.count({ where: { memberId: profileId, date: { gte: thirtyDaysAgo } } }),
    ])
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

    // Finance rate (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const paidMonths = await prisma.financialRecord.count({
        where: { memberId: profileId, status: "PAID", type: "MONTHLY_CONTRIBUTION", date: { gte: sixMonthsAgo } },
    })
    const financeRate = (paidMonths / 6) * 100

    // Academic score (average of exam scores)
    const grades = await prisma.academicRecord.findMany({
        where: { memberId: profileId, examScore: { not: null } },
        select: { examScore: true, totalScore: true },
    })
    let academicScore = 0
    if (grades.length > 0) {
        const avg = grades.reduce((sum, g) => {
            const score = g.totalScore ? (g.examScore! / g.totalScore) * 100 : g.examScore!
            return sum + score
        }, 0) / grades.length
        academicScore = avg
    } else {
        academicScore = 100 // No grades yet = not penalized
    }

    const isEligible =
        attendanceRate >= thresholds.MIN_ATTENDANCE_RATE &&
        financeRate >= thresholds.MIN_FINANCE_RATE &&
        academicScore >= thresholds.MIN_ACADEMIC_SCORE

    const reasons: string[] = []
    if (attendanceRate < thresholds.MIN_ATTENDANCE_RATE)
        reasons.push(`Attendance ${Math.round(attendanceRate)}% < ${thresholds.MIN_ATTENDANCE_RATE}%`)
    if (financeRate < thresholds.MIN_FINANCE_RATE)
        reasons.push(`Finance ${Math.round(financeRate)}% < ${thresholds.MIN_FINANCE_RATE}%`)
    if (grades.length > 0 && academicScore < thresholds.MIN_ACADEMIC_SCORE)
        reasons.push(`Academic score ${Math.round(academicScore)}% < ${thresholds.MIN_ACADEMIC_SCORE}%`)

    return {
        status: isEligible ? EligibilityStatus.ELIGIBLE : EligibilityStatus.INELIGIBLE,
        reason: reasons.length > 0 ? reasons.join("; ") : "All criteria met",
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        financeRate: Math.round(financeRate * 10) / 10,
        academicScore: Math.round(academicScore * 10) / 10,
    }
}

// GET: Fetch eligibility for all members (HR) or self (Member)
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN, Role.MEMBER])
    if (error) return error

    try {
        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { profile: { include: { eligibility: true } } },
            })
            return NextResponse.json(user?.profile?.eligibility || null)
        }

        const eligibilities = await prisma.serviceEligibility.findMany({
            include: {
                member: { select: { firstName: true, lastName: true, department: true, user: { select: { email: true } } } },
                overriddenBy: { select: { email: true } },
            },
            orderBy: { updatedAt: "desc" },
        })
        return NextResponse.json(eligibilities)
    } catch {
        return NextResponse.json({ error: "Failed to fetch eligibility" }, { status: 500 })
    }
}

// POST: Compute eligibility for one or all members
export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { memberId } = await req.json().catch(() => ({}))

        const profiles = memberId
            ? await prisma.memberProfile.findMany({ where: { id: memberId } })
            : await prisma.memberProfile.findMany({ where: { user: { role: "MEMBER" } } })

        const results = []
        for (const profile of profiles) {
            const computed = await computeEligibility(profile.id)
            const record = await prisma.serviceEligibility.upsert({
                where: { memberId: profile.id },
                create: { memberId: profile.id, ...computed, computedAt: new Date() },
                update: { ...computed, computedAt: new Date(), overriddenById: null, overrideReason: null },
            })
            results.push(record)
        }

        await logAction(session!.user.id, "ELIGIBILITY_COMPUTE", `Computed eligibility for ${results.length} members`, memberId)
        return NextResponse.json({ count: results.length, message: "Eligibility computed successfully" })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Failed to compute eligibility" }, { status: 500 })
    }
}

// PATCH: Manual override
export async function PATCH(req: NextRequest) {
    const { session, error } = await requireAuth([Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { memberId, status, overrideReason } = await req.json()

        const record = await prisma.serviceEligibility.upsert({
            where: { memberId },
            create: { memberId, status, overrideReason, overriddenById: session!.user.id, computedAt: new Date() },
            update: { status, overrideReason, overriddenById: session!.user.id },
        })

        await logAction(session!.user.id, "ELIGIBILITY_OVERRIDE", `Override for member ${memberId} → ${status}`, memberId)
        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: "Failed to override eligibility" }, { status: 500 })
    }
}
