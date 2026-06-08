import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"

export const dynamic = 'force-dynamic'

interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  url: string
}

interface SearchResultGroup {
  categoryKey: string
  items: SearchResultItem[]
}

export async function GET(req: NextRequest) {
  // Allow all authenticated users to use search (role filter applies inside)
  const { error, session } = await requireAuth([])
  if (error) return error

  const q = req.nextUrl.searchParams.get("q")?.trim() || ""

  if (q.length < 2) {
    return NextResponse.json([])
  }

  const role = session?.user?.role
  const userId = session?.user?.id
  const results: SearchResultGroup[] = []

  try {
    // 1. MEMBERS SEARCH
    // Available to Admin, Members Affairs, Finance, Education, Office, Choir
    const allowedForMemberSearch: string[] = [
      Role.SUPER_ADMIN,
      Role.MEMBERS_AFFAIRS,
      Role.FINANCE,
      Role.EDUCATION,
      Role.OFFICE,
      Role.CHOIR
    ]
    
    if (role && (role === Role.SUPER_ADMIN || allowedForMemberSearch.includes(role))) {
      const members = await prisma.memberProfile.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { phone: { contains: q } },
            { department: { contains: q } },
            { user: { email: { contains: q } } }
          ]
        },
        include: { user: true },
        take: 8
      })

      if (members.length > 0) {
        // Determine the target URL based on the user's dashboard role
        let targetBaseUrl = "/dashboard/members-affairs/members"
        if (role === Role.SUPER_ADMIN) targetBaseUrl = "/dashboard/admin/users"
        else if (role === Role.FINANCE) targetBaseUrl = "/dashboard/finance/ledger"
        else if (role === Role.EDUCATION) targetBaseUrl = "/dashboard/education/records"
        else if (role === Role.OFFICE) targetBaseUrl = "/dashboard/office/members"

        results.push({
          categoryKey: "topbar.categories.members",
          items: members.map(m => ({
            id: m.id,
            title: `${m.firstName} ${m.lastName}`,
            subtitle: `${m.department} Department — ${m.user.email}`,
            url: targetBaseUrl
          }))
        })
      }
    }

    // 2. ANNOUNCEMENTS SEARCH
    // Available to everyone
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } }
        ]
      },
      take: 5
    })

    if (announcements.length > 0) {
      const targetUrl = role === Role.SUPER_ADMIN ? "/dashboard/admin" : "/dashboard/member"
      results.push({
        categoryKey: "topbar.categories.announcements",
        items: announcements.map(a => ({
          id: a.id,
          title: a.title,
          subtitle: a.content.length > 60 ? `${a.content.substring(0, 60)}...` : a.content,
          url: targetUrl
        }))
      })
    }

    // 3. FINANCIAL RECORDS SEARCH
    // Available to Super Admin / Finance (all) or Member (their own)
    let financials: any[] = []
    if (role === Role.SUPER_ADMIN || role === Role.FINANCE) {
      financials = await prisma.financialRecord.findMany({
        where: {
          OR: [
            { receiptRef: { contains: q } },
            { type: { contains: q } },
            { description: { contains: q } },
            { member: { firstName: { contains: q } } },
            { member: { lastName: { contains: q } } }
          ]
        },
        include: { member: true },
        take: 5
      })
    } else if (role === Role.MEMBER && userId) {
      const profile = await prisma.memberProfile.findUnique({ where: { userId } })
      if (profile) {
        financials = await prisma.financialRecord.findMany({
          where: {
            memberId: profile.id,
            OR: [
              { receiptRef: { contains: q } },
              { type: { contains: q } },
              { description: { contains: q } }
            ]
          },
          take: 5
        })
      }
    }

    if (financials.length > 0) {
      const targetUrl = (role === Role.SUPER_ADMIN || role === Role.FINANCE) 
        ? "/dashboard/finance/ledger" 
        : "/dashboard/member/finance"

      results.push({
        categoryKey: "topbar.categories.finance",
        items: financials.map(f => ({
          id: f.id,
          title: `${f.type.replace(/_/g, ' ')} — ${f.amount} ETB`,
          subtitle: `Receipt: ${f.receiptRef || 'N/A'} — Status: ${f.status} ${f.member ? `(${f.member.firstName} ${f.member.lastName})` : ''}`,
          url: targetUrl
        }))
      })
    }

    // 4. ACADEMIC RECORDS SEARCH
    // Available to Super Admin / Education (all) or Member (their own)
    let academics: any[] = []
    if (role === Role.SUPER_ADMIN || role === Role.EDUCATION) {
      academics = await prisma.academicRecord.findMany({
        where: {
          OR: [
            { subjectName: { contains: q } },
            { gradeLabel: { contains: q } },
            { remarks: { contains: q } },
            { member: { firstName: { contains: q } } },
            { member: { lastName: { contains: q } } }
          ]
        },
        include: { member: true },
        take: 5
      })
    } else if (role === Role.MEMBER && userId) {
      const profile = await prisma.memberProfile.findUnique({ where: { userId } })
      if (profile) {
        academics = await prisma.academicRecord.findMany({
          where: {
            memberId: profile.id,
            OR: [
              { subjectName: { contains: q } },
              { gradeLabel: { contains: q } },
              { remarks: { contains: q } }
            ]
          },
          take: 5
        })
      }
    }

    if (academics.length > 0) {
      const targetUrl = (role === Role.SUPER_ADMIN || role === Role.EDUCATION)
        ? "/dashboard/education/records"
        : "/dashboard/member/grades"

      results.push({
        categoryKey: "topbar.categories.academics",
        items: academics.map(a => ({
          id: a.id,
          title: `${a.subjectName || 'Academic'} — Grade: ${a.gradeLabel || 'N/A'}`,
          subtitle: `Remarks: ${a.remarks || 'None'} ${a.member ? `(${a.member.firstName} ${a.member.lastName})` : ''}`,
          url: targetUrl
        }))
      })
    }

    // 5. QUICK COMMAND ACTIONS
    // Match based on query
    const commands: { title: string; url: string; roles: string[] }[] = [
      { title: "Go to Dashboard Home", url: "/dashboard", roles: [] },
      { title: "Change Password Settings", url: "/dashboard/change-password", roles: [] },
      { title: "Manage User Directory", url: "/dashboard/admin/users", roles: [Role.SUPER_ADMIN] },
      { title: "View Audit Log History", url: "/dashboard/admin/logs", roles: [Role.SUPER_ADMIN] },
      { title: "View Financial Ledger", url: "/dashboard/finance/ledger", roles: [Role.SUPER_ADMIN, Role.FINANCE] },
      { title: "View Grade Sheets", url: "/dashboard/education/grades", roles: [Role.SUPER_ADMIN, Role.EDUCATION] },
      { title: "Check Choir Attendance", url: "/dashboard/choir/attendance", roles: [Role.SUPER_ADMIN, Role.CHOIR] },
      { title: "Office Clearance Portal", url: "/dashboard/office/clearance", roles: [Role.SUPER_ADMIN, Role.OFFICE] },
      { title: "Verify Attendance Check-in", url: "/dashboard/member/attendance", roles: [Role.MEMBER] }
    ]
 
    const matchedCommands = commands.filter(c => {
      const matchesQuery = c.title.toLowerCase().includes(q.toLowerCase())
      const hasPermission = c.roles.length === 0 || (role && (role === Role.SUPER_ADMIN || c.roles.includes(role)))
      return matchesQuery && hasPermission
    })

    if (matchedCommands.length > 0) {
      results.push({
        categoryKey: "topbar.categories.actions",
        items: matchedCommands.map((c, idx) => ({
          id: `cmd-${idx}`,
          title: c.title,
          subtitle: `Navigation Action`,
          url: c.url
        }))
      })
    }

    return NextResponse.json(results)
  } catch (err: any) {
    console.error("Global search API error:", err)
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
  }
}
