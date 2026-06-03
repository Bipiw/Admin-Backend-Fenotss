import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Clock, Shield, Calendar, CreditCard, GraduationCap, Bell } from "lucide-react"
import { ELIGIBILITY_THRESHOLDS } from "@/lib/constants"

export const dynamic = 'force-dynamic'

function ScoreRow({ icon: Icon, label, value, threshold }: { icon: any; label: string; value: number | null; threshold: number }) {
    const pct = value ?? 0
    const ok = pct >= threshold
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                </div>
                <span className={`font-semibold ${ok ? "text-green-600" : "text-red-600"}`}>
                    {pct.toFixed(1)}% {ok ? "✓" : `(min ${threshold}%)`}
                </span>
            </div>
            <Progress value={pct} className={`h-2 ${ok ? "[&>div]:bg-green-500" : "[&>div]:bg-red-400"}`} />
        </div>
    )
}

export default async function MemberServiceStatusPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { profile: { include: { eligibility: true, memberNotifications: { orderBy: { createdAt: "desc" }, take: 5 } } } },
    })

    if (!user?.profile) return (
        <div className="p-8"><p className="text-muted-foreground">Profile not set up yet. Please contact HR.</p></div>
    )

    const eligibility = user.profile.eligibility
    const notifications = user.profile.memberNotifications

    const statusConfig = {
        ELIGIBLE: {
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-950/20 border-green-200",
            label: "Eligible for Active Service",
            labelAm: "ለአገልግሎት ብቁ ነዎት",
            desc: "You meet all criteria and are cleared for active service participation.",
        },
        INELIGIBLE: {
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50 dark:bg-red-950/20 border-red-200",
            label: "Not Currently Eligible",
            labelAm: "አሁን ለአገልግሎት ብቁ አይደሉም",
            desc: "You do not meet one or more eligibility criteria. Please review the details below.",
        },
        PENDING: {
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200",
            label: "Under Review",
            labelAm: "በግምገማ ላይ",
            desc: "Your eligibility has not yet been computed. Please check back later or contact HR.",
        },
    }

    const cfg = eligibility ? statusConfig[eligibility.status as keyof typeof statusConfig] : statusConfig.PENDING
    const StatusIcon = cfg.icon

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Service Status</h2>
                <p className="text-muted-foreground">Your current eligibility and service assignments.</p>
            </div>

            {/* Main Status Card */}
            <Card className={`border-2 ${cfg.bg}`}>
                <CardContent className="p-6 flex items-start gap-4">
                    <StatusIcon className={`h-10 w-10 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1">
                        <h3 className={`text-xl font-bold ${cfg.color}`}>{cfg.label}</h3>
                        <p className="text-sm text-muted-foreground">{cfg.labelAm}</p>
                        <p className="mt-2 text-sm">{cfg.desc}</p>
                        {eligibility?.overrideReason && (
                            <p className="mt-2 text-sm italic text-muted-foreground">
                                Note from HR: {eligibility.overrideReason}
                            </p>
                        )}
                    </div>
                    {eligibility && (
                        <div className="text-right text-xs text-muted-foreground">
                            <div>Last computed</div>
                            <div>{new Date(eligibility.computedAt).toLocaleDateString()}</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Score Breakdown */}
            {eligibility && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Shield className="h-4 w-4" /> Eligibility Score Breakdown
                        </CardTitle>
                        <CardDescription>How your scores compare to the required thresholds.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <ScoreRow
                            icon={Calendar}
                            label="Attendance Rate (90-day window)"
                            value={eligibility.attendanceRate}
                            threshold={ELIGIBILITY_THRESHOLDS.MIN_ATTENDANCE_RATE}
                        />
                        <ScoreRow
                            icon={CreditCard}
                            label="Monthly Contributions (last 6 months)"
                            value={eligibility.financeRate}
                            threshold={ELIGIBILITY_THRESHOLDS.MIN_FINANCE_RATE}
                        />
                        <ScoreRow
                            icon={GraduationCap}
                            label="Academic Score"
                            value={eligibility.academicScore}
                            threshold={ELIGIBILITY_THRESHOLDS.MIN_ACADEMIC_SCORE}
                        />

                        {eligibility.reason && eligibility.status === "INELIGIBLE" && (
                            <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 p-3">
                                <p className="text-sm text-red-700 font-medium">Areas to improve:</p>
                                <p className="text-sm text-red-600 mt-1">{eligibility.reason}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Personal Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">My Department & Role</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <Badge className="mt-1">{user.profile.department}</Badge>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium text-sm mt-1">{new Date(user.profile.createdAt).toLocaleDateString("en-ET", { year: "numeric", month: "long" })}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications from HR */}
            {notifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Bell className="h-4 w-4" /> Notifications from HR
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {notifications.map(n => (
                            <div key={n.id} className="border-l-4 border-primary pl-4 py-2 space-y-0.5">
                                <p className="text-sm font-medium">{n.title}</p>
                                <p className="text-sm text-muted-foreground">{n.content}</p>
                                <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
