"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Save } from "lucide-react"
import { toast } from "sonner"

type Member = { id: string; firstName: string; lastName: string; department: string }
type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED"

export default function ChoirAttendancePage() {
    const [members, setMembers] = useState<Member[]>([])
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({})
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [existingRecords, setExistingRecords] = useState<any[]>([])

    useEffect(() => {
        fetchChoirMembers()
    }, [])

    useEffect(() => {
        fetchExisting()
    }, [date])

    const fetchChoirMembers = async () => {
        try {
            const res = await fetch("/api/users")
            const data = await res.json()
            if (Array.isArray(data)) {
                const choir = data.filter((u: any) => u.profile?.department === "CHOIR" && u.role === "MEMBER")
                setMembers(choir.map((u: any) => ({
                    id: u.profile.id,
                    firstName: u.profile.firstName,
                    lastName: u.profile.lastName,
                    department: u.profile.department,
                })))
                // Default all to PRESENT
                const defaults: Record<string, AttendanceStatus> = {}
                choir.forEach((u: any) => { defaults[u.profile.id] = "PRESENT" })
                setAttendance(defaults)
            }
        } catch { toast.error("Failed to load choir members") }
        finally { setLoading(false) }
    }

    const fetchExisting = async () => {
        try {
            const res = await fetch(`/api/choir/attendance?date=${date}`)
            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
                setExistingRecords(data)
                const existing: Record<string, AttendanceStatus> = {}
                data.forEach((r: any) => { existing[r.memberId] = r.status })
                setAttendance(prev => ({ ...prev, ...existing }))
            }
        } catch { /* ignore */ }
    }

    const setStatus = (memberId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [memberId]: status }))
    }

    const handleSave = async () => {
        if (members.length === 0) return toast.error("No choir members to record.")
        setSaving(true)
        try {
            const records = members.map(m => ({ memberId: m.id, status: attendance[m.id] || "PRESENT" }))
            const res = await fetch("/api/choir/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: new Date(date).toISOString(), records }),
            })
            if (res.ok) {
                toast.success("Choir attendance saved successfully!")
                fetchExisting()
            } else {
                const err = await res.json()
                toast.error(err.error || "Failed to save attendance")
            }
        } catch { toast.error("Network error") }
        finally { setSaving(false) }
    }

    const counts = {
        present: Object.values(attendance).filter(s => s === "PRESENT").length,
        absent: Object.values(attendance).filter(s => s === "ABSENT").length,
        excused: Object.values(attendance).filter(s => s === "EXCUSED").length,
    }

    const statusIcon = (s: AttendanceStatus) =>
        s === "PRESENT" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
        s === "ABSENT" ? <XCircle className="h-4 w-4 text-red-500" /> :
        <Clock className="h-4 w-4 text-yellow-500" />

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Choir Attendance</h2>
                    <p className="text-muted-foreground">Record practice & service attendance for choir members.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm bg-background"
                    />
                    <Button onClick={handleSave} disabled={saving || members.length === 0}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Attendance"}
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-lg">
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{counts.present}</div>
                        <div className="text-xs text-muted-foreground">Present</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{counts.absent}</div>
                        <div className="text-xs text-muted-foreground">Absent</div>
                    </CardContent>
                </Card>
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{counts.excused}</div>
                        <div className="text-xs text-muted-foreground">Excused</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        Choir Roster
                    </CardTitle>
                    <CardDescription>
                        {existingRecords.length > 0
                            ? `⚠️ Attendance already recorded for this date. Saving will add new records.`
                            : `Mark attendance for ${date}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground text-sm">Loading choir members...</p>
                    ) : members.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No choir members found.</p>
                            <p className="text-sm text-muted-foreground mt-1">Members must be assigned to the CHOIR department.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((m, i) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                        <TableCell className="font-medium">{m.firstName} {m.lastName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {statusIcon(attendance[m.id] || "PRESENT")}
                                                <Badge
                                                    variant={attendance[m.id] === "PRESENT" ? "default" : attendance[m.id] === "ABSENT" ? "destructive" : "secondary"}
                                                >
                                                    {attendance[m.id] || "PRESENT"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={attendance[m.id] === "PRESENT" ? "default" : "outline"}
                                                    onClick={() => setStatus(m.id, "PRESENT")}
                                                    className="h-7 px-2 text-xs"
                                                >✓ Present</Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[m.id] === "ABSENT" ? "destructive" : "outline"}
                                                    onClick={() => setStatus(m.id, "ABSENT")}
                                                    className="h-7 px-2 text-xs"
                                                >✗ Absent</Button>
                                                <Button
                                                    size="sm"
                                                    variant={attendance[m.id] === "EXCUSED" ? "secondary" : "outline"}
                                                    onClick={() => setStatus(m.id, "EXCUSED")}
                                                    className="h-7 px-2 text-xs"
                                                >~ Excused</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
