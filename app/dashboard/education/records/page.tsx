"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RecordsPage() {
    const [search, setSearch] = useState("")
    const [records, setRecords] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Enrollment form state
    const [selectedUser, setSelectedUser] = useState("")
    const [selectedYear, setSelectedYear] = useState("1")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const fetchRecords = () => {
        setLoading(true)
        fetch("/api/education")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecords(data)
                } else {
                    console.error("Failed to load records:", data)
                    setRecords([])
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Error loading records:", err)
                setRecords([])
                setLoading(false)
            })
    }

    const fetchUsers = () => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter members who aren't in records already (or just allow re-enrollment logic)
                    setUsers(data.filter(u => u.role === "MEMBER"))
                }
            })
    }

    useEffect(() => {
        fetchRecords()
        fetchUsers()
    }, [])

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) return alert("Select a member to enroll")

        setSubmitting(true)
        try {
            const res = await fetch("/api/education", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    memberId: users.find(u => u.id === selectedUser)?.profile?.id,
                    year: parseInt(selectedYear),
                    status: "ENROLLED"
                })
            })

            if (res.ok) {
                alert("Student enrolled successfully!")
                setIsDialogOpen(false)
                fetchRecords()
            } else {
                const data = await res.json()
                alert(data.error || "Enrollment failed")
            }
        } catch (err) {
            alert("Error enrolling student")
        } finally {
            setSubmitting(false)
        }
    }

    const filtered = records.filter(r =>
        (r.member.firstName + " " + r.member.lastName).toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Student Records</h2>
                    <p className="text-muted-foreground">Manage and enroll members into academic levels.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Enroll New Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Student Enrollment</DialogTitle>
                                <DialogDescription>Assign a member to an academic year.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEnroll} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Select Member</Label>
                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a member..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.profile?.firstName} {u.profile?.lastName} ({u.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Academic Year</Label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6].map(y => (
                                                <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? "Enrolling..." : "Complete Enrollment"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={fetchRecords} variant="outline" size="sm">Reload Records</Button>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by student name..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Academic Level</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8">Loading students...</TableCell></TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8">
                                {records.length === 0 ? "No student records found." : "No matching records found."}
                            </TableCell></TableRow>
                        ) : (
                            filtered.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-bold">Year {r.year}</TableCell>
                                    <TableCell>{r.member.firstName} {r.member.lastName}</TableCell>
                                    <TableCell>{r.status}</TableCell>
                                    <TableCell>{r.remarks}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
