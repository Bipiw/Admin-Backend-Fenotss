"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, User, Mail, Phone, Building, GraduationCap, CreditCard, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfficeMembersPage() {
    const [members, setMembers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<any>(null)
    const [memberDetail, setMemberDetail] = useState<any>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    useEffect(() => {
        fetch("/api/users")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setMembers(data.filter((u: any) => u.role === "MEMBER"))
            })
            .finally(() => setLoading(false))
    }, [])

    const filtered = members.filter(m =>
        (`${m.profile?.firstName} ${m.profile?.lastName}`).toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.profile?.department || "").toLowerCase().includes(search.toLowerCase())
    )

    const viewMember = async (m: any) => {
        setSelected(m)
        setDetailLoading(true)
        try {
            const [grades, finance, attendance] = await Promise.all([
                fetch(`/api/grades?memberId=${m.profile?.id}`).then(r => r.json()),
                fetch(`/api/finance?memberId=${m.profile?.id}`).then(r => r.json()),
                fetch(`/api/attendance?limit=10`).then(r => r.json()),
            ])
            setMemberDetail({ grades, finance, attendance: attendance.data || [] })
        } catch {
            setMemberDetail(null)
        }
        setDetailLoading(false)
    }

    const deptColor: Record<string, string> = {
        CHOIR: "bg-purple-100 text-purple-700",
        SUNDAY_SCHOOL: "bg-blue-100 text-blue-700",
        DEACONS: "bg-amber-100 text-amber-700",
        OTHER: "bg-gray-100 text-gray-700",
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Global Member Search</h2>
                <p className="text-muted-foreground">View all member records across the organization.</p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, or department..."
                    className="pl-9"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{filtered.length} Members Found</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead className="text-right">View</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No members found.</TableCell></TableRow>
                            ) : (
                                filtered.map(m => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                                    {m.profile?.firstName?.[0]}{m.profile?.lastName?.[0]}
                                                </div>
                                                {m.profile?.firstName} {m.profile?.lastName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{m.email}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${deptColor[m.profile?.department] || deptColor.OTHER}`}>
                                                {m.profile?.department || "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm">{m.profile?.phone || "—"}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(m.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" onClick={() => viewMember(m)}>
                                                View Profile
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Member Detail Dialog */}
            <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setMemberDetail(null) }}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {selected?.profile?.firstName} {selected?.profile?.lastName}
                        </DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            {/* Profile Info */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />{selected.email}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />{selected.profile?.phone || "No phone"}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building className="h-4 w-4" />{selected.profile?.department}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />Joined {new Date(selected.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {detailLoading ? (
                                <p className="text-sm text-muted-foreground">Loading records...</p>
                            ) : memberDetail && (
                                <>
                                    {/* Grades */}
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                                            <GraduationCap className="h-4 w-4" /> Academic Records ({memberDetail.grades?.length || 0})
                                        </h4>
                                        {memberDetail.grades?.length > 0 ? (
                                            <div className="space-y-1">
                                                {memberDetail.grades.slice(0, 3).map((g: any) => (
                                                    <div key={g.id} className="flex justify-between text-sm border rounded px-3 py-1.5">
                                                        <span>{g.subjectName || "General"} · Year {g.year}</span>
                                                        <span className="font-medium">{g.examScore}/{g.totalScore} {g.gradeLabel && `(${g.gradeLabel})`}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-xs text-muted-foreground">No grades recorded.</p>}
                                    </div>

                                    {/* Finance */}
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                                            <CreditCard className="h-4 w-4" /> Recent Payments ({memberDetail.finance?.length || 0})
                                        </h4>
                                        {memberDetail.finance?.length > 0 ? (
                                            <div className="space-y-1">
                                                {memberDetail.finance.slice(0, 3).map((f: any) => (
                                                    <div key={f.id} className="flex justify-between text-sm border rounded px-3 py-1.5">
                                                        <span>{f.type} · {new Date(f.date).toLocaleDateString()}</span>
                                                        <Badge variant={f.status === "PAID" ? "default" : "destructive"}>
                                                            {f.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-xs text-muted-foreground">No payment records.</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
