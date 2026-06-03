"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Activity,
    UserPlus,
    UserMinus,
    DollarSign,
    CalendarCheck,
    GraduationCap,
    Megaphone,
    UserCog,
    Building2,
    FileEdit,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface AuditLogItem {
    id: string
    action: string
    details: string | null
    createdAt: string
    user: {
        email: string
        role: string
        profile: { firstName: string; lastName: string } | null
    } | null
}

const actionMeta: Record<string, { icon: typeof Activity; color: string; label: string }> = {
    USER_UPDATE: { icon: UserCog, color: "text-blue-600 bg-blue-500/10", label: "User Updated" },
    USER_DELETE: { icon: UserMinus, color: "text-red-600 bg-red-500/10", label: "User Deleted" },
    USER_CREATE: { icon: UserPlus, color: "text-emerald-600 bg-emerald-500/10", label: "User Created" },
    FINANCE_RECORD: { icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10", label: "Payment" },
    ATTENDANCE_LOG: { icon: CalendarCheck, color: "text-violet-600 bg-violet-500/10", label: "Attendance" },
    EDUCATION_CREATE: { icon: GraduationCap, color: "text-amber-600 bg-amber-500/10", label: "Enrollment" },
    EDUCATION_UPDATE: { icon: FileEdit, color: "text-amber-600 bg-amber-500/10", label: "Edu. Update" },
    ANNOUNCEMENT_CREATE: { icon: Megaphone, color: "text-[#ffab00] bg-[#ffab00]/15", label: "Announcement" },
    ANNOUNCEMENT_DELETE: { icon: Megaphone, color: "text-red-600 bg-red-500/10", label: "Announcement" },
    DEPT_ASSIGN: { icon: Building2, color: "text-indigo-600 bg-indigo-500/10", label: "Department" },
}

function relativeTime(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d ago`
    return new Date(date).toLocaleDateString()
}

export function RecentActivity() {
    const [logs, setLogs] = useState<AuditLogItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/audit-logs?limit=8")
            .then((r) => r.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.data || []
                setLogs(list.slice(0, 8))
            })
            .catch(() => setLogs([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                </div>
                <Link
                    href="/dashboard/admin/logs"
                    className="text-xs font-medium text-[#ffab00] hover:underline"
                >
                    View all
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-3 animate-pulse">
                                <div className="h-9 w-9 rounded-lg bg-muted" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 w-3/4 rounded bg-muted" />
                                    <div className="h-2 w-1/2 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No activity yet
                    </p>
                ) : (
                    logs.map((log) => {
                        const meta =
                            actionMeta[log.action] || {
                                icon: Activity,
                                color: "text-muted-foreground bg-muted",
                                label: log.action,
                            }
                        const Icon = meta.icon
                        const userName = log.user?.profile
                            ? `${log.user.profile.firstName} ${log.user.profile.lastName}`
                            : log.user?.email || "System"
                        return (
                            <div key={log.id} className="flex items-start gap-3">
                                <div className={cn("rounded-lg p-2 shrink-0", meta.color)}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-medium truncate">{userName}</p>
                                        <Badge variant="outline" className="text-[10px] py-0 h-4">
                                            {meta.label}
                                        </Badge>
                                    </div>
                                    {log.details && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {log.details}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-muted-foreground/70">
                                        {relativeTime(log.createdAt)}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}
