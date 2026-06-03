"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, RefreshCw, Bell, Search, CheckCircle2, XCircle, Clock, Edit } from "lucide-react"
import { toast } from "sonner"
import { ELIGIBILITY_THRESHOLDS } from "@/lib/constants"

type EligibilityStatus = "ELIGIBLE" | "INELIGIBLE" | "PENDING"

function StatusBadge({ status }: { status: EligibilityStatus }) {
    if (status === "ELIGIBLE") return <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="h-3 w-3 mr-1" />Eligible</Badge>
    if (status === "INELIGIBLE") return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Ineligible</Badge>
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
}

function ScoreBar({ value, threshold, label }: { value: number | null; threshold: number; label: string }) {
    const pct = value ?? 0
    const ok = pct >= threshold
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className={ok ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {pct.toFixed(1)}% {ok ? "✓" : `(min ${threshold}%)`}
                </span>
            </div>
            <Progress value={pct} className={`h-1.5 ${ok ? "[&>div]:bg-green-500" : "[&>div]:bg-red-400"}`} />
        </div>
    )
}

export default function EligibilityPage() {
    const [records, setRecords] = useState<any[]>([])
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [computing, setComputing] = useState(false)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("ALL")

    // Override dialog
    const [overrideOpen, setOverrideOpen] = useState(false)
    const [overrideMember, setOverrideMember] = useState<any>(null)
    const [overrideStatus, setOverrideStatus] = useState<EligibilityStatus>("ELIGIBLE")
    const [overrideReason, setOverrideReason] = useState("")

    // Notification dialog
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifTarget, setNotifTarget] = useState<any>(null)
    const [notifTitle, setNotifTitle] = useState("")
    const [notifContent, setNotifContent] = useState("")
    const [notifSending, setNotifSending] = useState(false)

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        setLoading(true)
        const [eligRes, usersRes] = await Promise.all([
            fetch("/api/eligibility"),
            fetch("/api/users"),
        ])
        const eligData = await eligRes.json()
        const usersData = await usersRes.json()
        if (Array.isArray(eligData)) setRecords(eligData)
        if (Array.isArray(usersData)) setMembers(usersData.filter((u: any) => u.role === "MEMBER"))
        setLoading(false)
    }

    const computeAll = async () => {
        setComputing(true)
        const res = await fetch("/api/eligibility", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
        if (res.ok) {
            const data = await res.json()
            toast.success(`Eligibility computed for ${data.count} members.`)
            fetchData()
        } else toast.error("Failed to compute eligibility")
        setComputing(false)
    }

    const computeOne = async (memberId: string) => {
        const res = await fetch("/api/eligibility", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId }),
        })
        if (res.ok) { toast.success("Eligibility recomputed."); fetchData() }
        else toast.error("Failed")
    }

    const handleOverride = async () => {
        if (!overrideMember || !overrideReason) return toast.error("Please provide a reason.")
        const res = await fetch("/api/eligibility", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: overrideMember.member?.id, status: overrideStatus, overrideReason }),
        })
        if (res.ok) {
            toast.success("Override saved.")
            setOverrideOpen(false)
            fetchData()
        } else toast.error("Failed to override")
    }

    const sendNotif = async () => {
        if (!notifContent || !notifTitle) return toast.error("Fill in title and content.")
        setNotifSending(true)
        const memberId = notifTarget?.member?.id
        const res = await fetch("/api/notifications/member", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberIds: [memberId], title: notifTitle, content: notifContent, type: "ELIGIBILITY" }),
        })
        if (res.ok) {
            toast.success("Notification sent!")
            setNotifOpen(false)
            setNotifTitle(""); setNotifContent("")
        } else toast.error("Failed to send")
        setNotifSending(false)
    }

    const openOverride = (r: any) => {
        setOverrideMember(r)
        setOverrideStatus(r.status)
        setOverrideReason(r.overrideReason || "")
        setOverrideOpen(true)
    }

    const openNotif = (r: any) => {
        setNotifTarget(r)
        const name = `${r.member?.firstName} ${r.member?.lastName}`
        setNotifTitle(r.status === "INELIGIBLE" ? "Service Eligibility Update" : "Congratulations!")
        setNotifContent(r.status === "INELIGIBLE"
            ? `Dear ${name}, after reviewing your records you are currently not eligible for active service. Reason: ${r.reason}. Please contact the HR department for more details.`
            : `Dear ${name}, we are pleased to inform you that you are eligible for active service. Keep up the excellent work!`
        )
        setNotifOpen(true)
    }

    // Members without eligibility record
    const membersWithoutRecord = members.filter(m =>
        !records.find(r => r.member?.user?.email === m.email)
    )

    const filtered = records.filter(r => {
        const name = `${r.member?.firstName} ${r.member?.lastName}`.toLowerCase()
        const matchSearch = name.includes(search.toLowerCase())
        const matchStatus = filterStatus === "ALL" || r.status === filterStatus
        return matchSearch && matchStatus
    })

    const stats = {
        eligible: records.filter(r => r.status === "ELIGIBLE").length,
        ineligible: records.filter(r => r.status === "INELIGIBLE").length,
        pending: records.filter(r => r.status === "PENDING").length,
        uncomputed: membersWithoutRecord.length,
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Service Eligibility Engine</h2>
                    <p className="text-muted-foreground">Aggregate and evaluate member readiness for active service.</p>
                </div>
                <Button onClick={computeAll} disabled={computing} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${computing ? "animate-spin" : ""}`} />
                    {computing ? "Computing..." : "Recompute All"}
                </Button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Eligible", count: stats.eligible, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20 border-green-200" },
                    { label: "Ineligible", count: stats.ineligible, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20 border-red-200" },
                    { label: "Pending", count: stats.pending, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200" },
                    { label: "Uncomputed", count: stats.uncomputed, color: "text-muted-foreground", bg: "bg-muted/40 border-muted" },
                ].map(s => (
                    <Card key={s.label} className={`border ${s.bg}`}>
                        <CardContent className="p-4 text-center">
                            <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
                            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Thresholds Info */}
            <Card className="bg-muted/30">
                <CardContent className="p-4 flex items-center gap-6 flex-wrap text-sm">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">Eligibility Criteria:</span>
                    </div>
                    <span>🕐 Attendance ≥ {ELIGIBILITY_THRESHOLDS.MIN_ATTENDANCE_RATE}%</span>
                    <span>💰 Finance ≥ {ELIGIBILITY_THRESHOLDS.MIN_FINANCE_RATE}%</span>
                    <span>📚 Academic ≥ {ELIGIBILITY_THRESHOLDS.MIN_ACADEMIC_SCORE}%</span>
                </CardContent>
            </Card>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search member..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="ELIGIBLE">Eligible</SelectItem>
                        <SelectItem value="INELIGIBLE">Ineligible</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score Breakdown</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        {records.length === 0
                                            ? <span>No eligibility data yet. Click <strong>Recompute All</strong> to begin.</span>
                                            : "No matching records."}
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">
                                        {r.member?.firstName} {r.member?.lastName}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{r.member?.department}</TableCell>
                                    <TableCell><StatusBadge status={r.status} /></TableCell>
                                    <TableCell className="min-w-[200px]">
                                        <div className="space-y-1.5">
                                            <ScoreBar value={r.attendanceRate} threshold={ELIGIBILITY_THRESHOLDS.MIN_ATTENDANCE_RATE} label="Attendance" />
                                            <ScoreBar value={r.financeRate} threshold={ELIGIBILITY_THRESHOLDS.MIN_FINANCE_RATE} label="Finance" />
                                            <ScoreBar value={r.academicScore} threshold={ELIGIBILITY_THRESHOLDS.MIN_ACADEMIC_SCORE} label="Academic" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground max-w-[160px]">
                                        {r.overrideReason ? <span className="italic">Override: {r.overrideReason}</span> : r.reason}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button size="sm" variant="ghost" title="Recompute" onClick={() => computeOne(r.memberId)}>
                                                <RefreshCw className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button size="sm" variant="ghost" title="Manual Override" onClick={() => openOverride(r)}>
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button size="sm" variant="ghost" title="Send Notification" onClick={() => openNotif(r)}>
                                                <Bell className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Uncomputed Members */}
            {membersWithoutRecord.length > 0 && (
                <Card className="border-dashed">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {membersWithoutRecord.length} member(s) not yet computed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {membersWithoutRecord.map(m => (
                                <span key={m.id} className="text-xs bg-muted px-2 py-1 rounded-full">
                                    {m.profile?.firstName} {m.profile?.lastName}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Override Dialog */}
            <Dialog open={overrideOpen} onOpenChange={setOverrideOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manual Override — {overrideMember?.member?.firstName} {overrideMember?.member?.lastName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Override Status</Label>
                            <Select value={overrideStatus} onValueChange={(v: any) => setOverrideStatus(v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ELIGIBLE">✅ Eligible</SelectItem>
                                    <SelectItem value="INELIGIBLE">❌ Ineligible</SelectItem>
                                    <SelectItem value="PENDING">⏳ Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Override *</Label>
                            <Textarea
                                placeholder="Explain why you are manually overriding this status..."
                                value={overrideReason}
                                onChange={e => setOverrideReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOverrideOpen(false)}>Cancel</Button>
                        <Button onClick={handleOverride}>Save Override</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notification Dialog */}
            <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Send Notification to {notifTarget?.member?.firstName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea rows={5} value={notifContent} onChange={e => setNotifContent(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNotifOpen(false)}>Cancel</Button>
                        <Button onClick={sendNotif} disabled={notifSending}>
                            {notifSending ? "Sending..." : "Send Notification"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
