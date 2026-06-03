import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen } from "lucide-react"

export const dynamic = 'force-dynamic'

function scoreToPercent(exam: number | null, total: number | null) {
    if (!exam || !total || total === 0) return 0
    return Math.round((exam / total) * 100)
}

function gradeBadge(pct: number) {
    if (pct >= 80) return "default"
    if (pct >= 60) return "secondary"
    return "destructive"
}

export default async function MemberGradesPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { profile: true },
    })

    if (!user?.profile) return (
        <div className="p-8"><p className="text-muted-foreground">Profile not found. Please contact HR.</p></div>
    )

    const grades = await prisma.academicRecord.findMany({
        where: { memberId: user.profile.id, examScore: { not: null } },
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    })

    // Group by year & semester
    const grouped: Record<string, typeof grades> = {}
    for (const g of grades) {
        const key = `${g.year} — ${g.semester || "General"}`
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(g)
    }

    const overallAvg = grades.length > 0
        ? Math.round(grades.reduce((s, g) => s + scoreToPercent(g.examScore, g.totalScore), 0) / grades.length)
        : null

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Academic Records</h2>
                    <p className="text-muted-foreground">Your grades and exam results across all subjects.</p>
                </div>
                {overallAvg !== null && (
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Overall Average</div>
                        <div className={`text-3xl font-bold ${overallAvg >= 80 ? "text-green-600" : overallAvg >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                            {overallAvg}%
                        </div>
                    </div>
                )}
            </div>

            {grades.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No grade records available yet.</p>
                        <p className="text-sm text-muted-foreground mt-1">Your grades will appear here once the Education department records them.</p>
                    </CardContent>
                </Card>
            ) : (
                Object.entries(grouped).map(([period, periodGrades]) => {
                    const periodAvg = Math.round(periodGrades.reduce((s, g) => s + scoreToPercent(g.examScore, g.totalScore), 0) / periodGrades.length)
                    return (
                        <Card key={period}>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="h-4 w-4" />
                                    {period}
                                </CardTitle>
                                <Badge variant={gradeBadge(periodAvg)}>Avg: {periodAvg}%</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {periodGrades.map(g => {
                                        const pct = scoreToPercent(g.examScore, g.totalScore)
                                        return (
                                            <div key={g.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                                <div>
                                                    <p className="text-sm font-medium">{g.subjectName || "General"}</p>
                                                    {g.remarks && <p className="text-xs text-muted-foreground">{g.remarks}</p>}
                                                </div>
                                                <div className="flex items-center gap-3 text-right">
                                                    <span className="text-sm text-muted-foreground">
                                                        {g.examScore}/{g.totalScore}
                                                    </span>
                                                    <Badge variant={gradeBadge(pct)}>
                                                        {g.gradeLabel || `${pct}%`}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
            )}
        </div>
    )
}
