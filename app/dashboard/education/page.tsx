import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { ChangePasswordCard } from "@/components/dashboard/change-password-card"

export const dynamic = 'force-dynamic'

export default async function EducationDashboard() {
    const totalStudents = await prisma.user.count({ where: { role: 'MEMBER' } })

    // Count by level (year)
    const studentsByLevel = await prisma.academicRecord.groupBy({
        by: ['year'],
        where: { status: 'ENROLLED' },
        _count: { memberId: true }
    })

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Academic Overview</h2>
                <EthiopianDateDisplay />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Active enrolled members</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Enrollment by Level</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {studentsByLevel.map(level => (
                        <Card key={level.year}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Year {level.year}</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{level._count.memberId}</div>
                                <p className="text-xs text-muted-foreground">Students</p>
                            </CardContent>
                        </Card>
                    ))}
                    {studentsByLevel.length === 0 && <p className="text-muted-foreground">No enrollment data available.</p>}
                </div>
            </div>

            <div className="max-w-md">
                <ChangePasswordCard />
            </div>
        </div>
    )
}
