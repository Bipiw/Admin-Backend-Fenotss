"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EnrollmentPage() {
    const [currentYear, setCurrentYear] = useState("1")
    const [targetYear, setTargetYear] = useState("2")
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState<any[]>([])
    const [selected, setSelected] = useState<Record<string, boolean>>({})

    const fetchStudents = () => {
        setLoading(true)
        fetch(`/api/education?year=${currentYear}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStudents(data)
                } else {
                    setStudents([])
                    console.error("Failed to fetch students:", data.error)
                }
                setSelected({}) // Reset selection
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setStudents([])
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchStudents()
    }, [currentYear])

    const handlePromote = async () => {
        try {
            const toPromote = students.filter(s => selected[s.id])
            if (toPromote.length === 0) return alert("Select students to promote")

            const promises = toPromote.map(s =>
                fetch("/api/education", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        memberId: s.memberId,
                        year: parseInt(targetYear),
                        status: "ENROLLED",
                        remarks: `Promoted from Year ${currentYear}`
                    })
                })
            )

            await Promise.all(promises)
            alert("Promotion successful!")
            fetchStudents() // Refresh list
        } catch (e) {
            alert("Error promoting students")
        }
    }

    const toggleSelect = (id: string) => {
        setSelected(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const toggleAll = () => {
        const allSelected = students.length > 0 && students.every(s => selected[s.id])
        const newSelected: Record<string, boolean> = {}
        students.forEach(s => newSelected[s.id] = !allSelected)
        setSelected(newSelected)
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Enrollment & Promotion</h2>
                <p className="text-muted-foreground">Bulk promote students to the next academic level.</p>
            </div>

            <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg">
                <div className="space-y-2 w-32">
                    <Label>From Year</Label>
                    <Select value={currentYear} onValueChange={setCurrentYear}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 w-32">
                    <Label>To Year</Label>
                    <Select value={targetYear} onValueChange={setTargetYear}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handlePromote}>Promote Selected</Button>
                <Button variant="ghost" onClick={fetchStudents}>Refresh</Button>
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={students.length > 0 && students.every(s => selected[s.id])}
                                    onCheckedChange={toggleAll}
                                />
                            </TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Current Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-8">Loading students...</TableCell></TableRow>
                        ) : students.length === 0 ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-8">No students found in Year {currentYear}</TableCell></TableRow>
                        ) : (
                            students.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={!!selected[s.id]}
                                            onCheckedChange={() => toggleSelect(s.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{s.member.firstName} {s.member.lastName}</TableCell>
                                    <TableCell>{s.status}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
