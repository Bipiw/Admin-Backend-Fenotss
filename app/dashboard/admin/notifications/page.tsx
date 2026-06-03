"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Activity,
    Search,
    Filter,
    Download,
    UserPlus,
    UserMinus,
    DollarSign,
    CalendarCheck,
    GraduationCap,
    Megaphone,
    UserCog,
    Building2,
    FileEdit,
    Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AuditLog {
    id: string
    action: string
    details: string | null
    createdAt: string
    targetId: string | null
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
    return new Date(date).toLocaleString()
}

export default function NotificationsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<string>("ALL")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: "20" })
        if (filter !== "ALL") params.set("action", filter)

        fetch(`/api/audit-logs?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setLogs(data)
                    setTotalPages(1)
                } else {
                    setLogs(data.data || [])
                    setTotalPages(data.totalPages || 1)
                }
            })
            .catch(() => setLogs([]))
            .finally(() => setLoading(false))
    }, [page, filter])

    const filtered = logs.filter((log) => {
        if (!search) return true
        const term = search.toLowerCase()
        return (
            log.action.toLowerCase().includes(term) ||
            (log.details || "").toLowerCase().includes(term) ||
            (log.user?.email || "").toLowerCase().includes(term)
        )
    })

    const exportCSV = () => {
        const rows = [
            ["Time", "User", "Role", "Action", "Details"],
            ...filtered.map((l) => [
                new Date(l.createdAt).toISOString(),
                l.user?.email || "",
                l.user?.role || "",
                l.action,
                (l.details || "").replace(/"/g, '""'),
            ]),
        ]
        const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `notifications-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Bell className="h-7 w-7 text-[#ffab00]" />
                        Notifications Center
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Live activity feed across all departments
                    </p>
                </div>
                <Button onClick={exportCSV} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by user, action, or details..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1) }}>
                            <SelectTrigger className="sm:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Actions</SelectItem>
                                {Object.keys(actionMeta).map((key) => (
                                    <SelectItem key={key} value={key}>
                                        {actionMeta[key].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3 py-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="h-10 w-10 rounded-lg bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-2/3 rounded bg-muted" />
                                        <div className="h-2 w-1/3 rounded bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-12">
                            No activity matches your filters
                        </p>
                    ) : (
                        <div className="divide-y">
                            {filtered.map((log) => {
                                const meta = actionMeta[log.action] || {
                                    icon: Activity,
                                    color: "text-muted-foreground bg-muted",
                                    label: log.action,
                                }
                                const Icon = meta.icon
                                const userName = log.user?.profile
                                    ? `${log.user.profile.firstName} ${log.user.profile.lastName}`
                                    : log.user?.email || "System"

                                return (
                                    <div key={log.id} className="flex items-start gap-4 py-3">
                                        <div className={cn("rounded-lg p-2.5 shrink-0", meta.color)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold">{userName}</p>
                                                <Badge variant="outline" className="text-[10px] py-0 h-5">
                                                    {meta.label}
                                                </Badge>
                                                {log.user?.role && (
                                                    <Badge variant="secondary" className="text-[10px] py-0 h-5">
                                                        {log.user.role}
                                                    </Badge>
                                                )}
                                            </div>
                                            {log.details && (
                                                <p className="text-sm text-muted-foreground mt-1 break-words">
                                                    {log.details}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                {relativeTime(log.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
