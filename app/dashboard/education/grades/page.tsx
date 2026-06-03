"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Plus, Search, Edit2, Trash2, BookOpen } from "lucide-react"
import { toast } from "sonner"

const SUBJECTS = [
    "ብሉይ ኪዳን", "አዲስ ኪዳን", "ቤተ ክርስቲያን ታሪክ", "ትምህርተ ሃይማኖት",
    "Old Testament", "New Testament", "Church History", "Catechism",
    "Ethics", "Liturgy", "Music / Choir Theory", "General"
]

const GRADE_LABELS = ["A+", "A", "B+", "B", "C+", "C", "D", "F", "ጥሩ", "ደካማ", "አለፈ", "አልፈለሰም"]

const currentYear = new Date().getFullYear()

function scoreToPercent(exam: number, total: number) {
    return total > 0 ? Math.round((exam / total) * 100) : 0
}

function percentBadge(pct: number) {
    if (pct >= 80) return "default"
    if (pct >= 60) return "secondary"
    return "destructive"
}

export default function EducationGradesPage() {
    const [members, setMembers] = useState<any[]>([])
    const [grades, setGrades] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterYear, setFilterYear] = useState(String(currentYear))
    const [open, setOpen] = useState(false)
    const [editGrade, setEditGrade] = useState<any>(null)
    const [form, setForm] = useState({
        memberId: "", year: String(currentYear), semester: "1st",
        subjectName: "", examScore: "", totalScore: "100",
        gradeLabel: "", remarks: "", status: "ENROLLED"
    })

    useEffect(() => { fetchData() }, [])
    useEffect(() => { fetchGrades() }, [filterYear])

    const fetchData = async () => {
        const [usersRes, gradesRes] = await Promise.all([
            fetch("/api/users"), fetch(`/api/grades?year=${currentYear}`)
        ])
        const users = await usersRes.json()
        const gradesData = await gradesRes.json()
        if (Array.isArray(users)) setMembers(users.filter((u: any) => u.role === "MEMBER"))
        if (Array.isArray(gradesData)) setGrades(gradesData)
        setLoading(false)
    }

    const fetchGrades = async () => {
        const res = await fetch(`/api/grades?year=${filterYear}`)
        const data = await res.json()
        if (Array.isArray(data)) setGrades(data)
    }

    const openAdd = () => {
        setEditGrade(null)
        setForm({ memberId: "", year: String(currentYear), semester: "1st", subjectName: "", examScore: "", totalScore: "100", gradeLabel: "", remarks: "", status: "ENROLLED" })
        setOpen(true)
    }

    const openEdit = (g: any) => {
        setEditGrade(g)
        setForm({
            memberId: g.memberId, year: String(g.year), semester: g.semester || "1st",
            subjectName: g.subjectName || "", examScore: String(g.examScore || ""),
            totalScore: String(g.totalScore || "100"), gradeLabel: g.gradeLabel || "",
            remarks: g.remarks || "", status: g.status || "ENROLLED"
        })
        setOpen(true)
    }

    const handleSave = async () => {
        if (!form.memberId || !form.subjectName || !form.examScore)
            return toast.error("Member, subject, and score are required.")

        const payload = {
            ...(editGrade ? { id: editGrade.id } : {}),
            memberId: form.memberId,
            year: parseInt(form.year),
            semester: form.semester,
            subjectName: form.subjectName,
            examScore: parseFloat(form.examScore),
            totalScore: parseFloat(form.totalScore),
            gradeLabel: form.gradeLabel || undefined,
            remarks: form.remarks || undefined,
            status: form.status,
        }

        const res = await fetch("/api/grades", {
            method: editGrade ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            toast.success(editGrade ? "Grade updated!" : "Grade recorded!")
            setOpen(false)
            fetchGrades()
        } else {
            const err = await res.json()
            toast.error(err.error || "Failed to save grade")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this grade record?")) return
        const res = await fetch(`/api/grades?id=${id}`, { method: "DELETE" })
        if (res.ok) { toast.success("Deleted"); fetchGrades() }
        else toast.error("Failed to delete")
    }

    const filtered = grades.filter(g => {
        const name = `${g.member?.firstName} ${g.member?.lastName}`.toLowerCase()
        return name.includes(search.toLowerCase()) || (g.subjectName || "").toLowerCase().includes(search.toLowerCase())
    })

    // Summary by member
    const memberSummary = members.map(m => {
        const mGrades = grades.filter(g => g.memberId === m.profile?.id)
        const avg = mGrades.length > 0
            ? Math.round(mGrades.reduce((s, g) => s + scoreToPercent(g.examScore, g.totalScore), 0) / mGrades.length)
            : null
        return { ...m, gradeCount: mGrades.length, average: avg }
    }).filter(m => m.gradeCount > 0)

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Grade Management</h2>
                    <p className="text-muted-foreground">Record and manage student exam scores and academic performance.</p>
                </div>
                <Button onClick={openAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Record Grade
                </Button>
            </div>

            <Tabs defaultValue="records">
                <TabsList>
                    <TabsTrigger value="records">All Grade Records</TabsTrigger>
                    <TabsTrigger value="summary">Student Summary</TabsTrigger>
                </TabsList>

                {/* All Records Tab */}
                <TabsContent value="records" className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by name or subject..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Select value={filterYear} onValueChange={setFilterYear}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Year / Semester</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
                                    ) : filtered.length === 0 ? (
                                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No grade records found.</TableCell></TableRow>
                                    ) : filtered.map(g => {
                                        const pct = scoreToPercent(g.examScore, g.totalScore)
                                        return (
                                            <TableRow key={g.id}>
                                                <TableCell className="font-medium">{g.member?.firstName} {g.member?.lastName}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {g.subjectName || "—"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">Year {g.year} · {g.semester || "—"}</TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{g.examScore}</span>
                                                    <span className="text-muted-foreground">/{g.totalScore}</span>
                                                    <span className="text-xs ml-1 text-muted-foreground">({pct}%)</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={percentBadge(pct)}>{g.gradeLabel || `${pct}%`}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">{g.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button size="sm" variant="ghost" onClick={() => openEdit(g)}><Edit2 className="h-3.5 w-3.5" /></Button>
                                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(g.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Summary Tab */}
                <TabsContent value="summary">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Student Performance Summary</CardTitle>
                            <CardDescription>Average scores per student for year {filterYear}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Records</TableHead>
                                        <TableHead>Average Score</TableHead>
                                        <TableHead>Performance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberSummary.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No grade data for this year.</TableCell></TableRow>
                                    ) : memberSummary.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">{m.profile?.firstName} {m.profile?.lastName}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{m.profile?.department}</TableCell>
                                            <TableCell>{m.gradeCount} subject{m.gradeCount !== 1 ? "s" : ""}</TableCell>
                                            <TableCell className="font-semibold">{m.average}%</TableCell>
                                            <TableCell>
                                                <Badge variant={percentBadge(m.average || 0)}>
                                                    {(m.average || 0) >= 80 ? "Excellent" : (m.average || 0) >= 60 ? "Passing" : "Needs Attention"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editGrade ? "Edit Grade" : "Record New Grade"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Student</Label>
                                <Select value={form.memberId} onValueChange={v => setForm(f => ({ ...f, memberId: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select student..." /></SelectTrigger>
                                    <SelectContent>
                                        {members.map(m => (
                                            <SelectItem key={m.profile?.id} value={m.profile?.id}>
                                                {m.profile?.firstName} {m.profile?.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Select value={form.year} onValueChange={v => setForm(f => ({ ...f, year: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Semester</Label>
                                <Select value={form.semester} onValueChange={v => setForm(f => ({ ...f, semester: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st">1st Semester</SelectItem>
                                        <SelectItem value="2nd">2nd Semester</SelectItem>
                                        <SelectItem value="Annual">Annual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Subject</Label>
                                <Select value={form.subjectName} onValueChange={v => setForm(f => ({ ...f, subjectName: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select subject..." /></SelectTrigger>
                                    <SelectContent>
                                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Score Obtained</Label>
                                <Input type="number" min={0} value={form.examScore} onChange={e => setForm(f => ({ ...f, examScore: e.target.value }))} placeholder="e.g. 85" />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Marks</Label>
                                <Input type="number" min={1} value={form.totalScore} onChange={e => setForm(f => ({ ...f, totalScore: e.target.value }))} placeholder="e.g. 100" />
                            </div>
                            <div className="space-y-2">
                                <Label>Grade Label (Optional)</Label>
                                <Select value={form.gradeLabel} onValueChange={v => setForm(f => ({ ...f, gradeLabel: v }))}>
                                    <SelectTrigger><SelectValue placeholder="A, B+, ጥሩ..." /></SelectTrigger>
                                    <SelectContent>
                                        {GRADE_LABELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENROLLED">Enrolled</SelectItem>
                                        <SelectItem value="GRADUATED">Graduated</SelectItem>
                                        <SelectItem value="DROPPED">Dropped</SelectItem>
                                        <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Remarks (Optional)</Label>
                                <Input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Any additional remarks..." />
                            </div>
                        </div>

                        {form.examScore && form.totalScore && (
                            <div className="bg-muted/50 rounded-md px-3 py-2 text-sm flex justify-between">
                                <span>Computed score:</span>
                                <Badge variant={percentBadge(scoreToPercent(parseFloat(form.examScore), parseFloat(form.totalScore)))}>
                                    {scoreToPercent(parseFloat(form.examScore), parseFloat(form.totalScore))}%
                                </Badge>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{editGrade ? "Update Grade" : "Save Grade"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
