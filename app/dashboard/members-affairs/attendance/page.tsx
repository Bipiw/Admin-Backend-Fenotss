"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

interface Member {
    id: string
    profile: {
        id: string
        firstName: string
        lastName: string
    }
}

export default function AttendanceLoggingPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [members, setMembers] = useState<Member[]>([])
    const [attendance, setAttendance] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)

    // Using browser alert for simplicity if useToast hooks are missing/complex context
    // But keeping structure

    useEffect(() => {
        // Fetch only MEMBER role users
        fetch("/api/users")
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    const filtered = data.filter((u: any) => u.role === 'MEMBER')
                    setMembers(filtered)
                    // Initialize all as PRESENT
                    const initialStatus: Record<string, string> = {}
                    filtered.forEach((m: any) => initialStatus[m.id] = "PRESENT")
                    setAttendance(initialStatus)
                    setLoading(false)
                } else {
                    console.error("Failed to fetch members:", data)
                    setMembers([])
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                setMembers([])
                setLoading(false)
            })
    }, [])

    const handleStatusChange = (memberId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [memberId]: status }))
    }

    const setAll = (status: string) => {
        const newStatus: Record<string, string> = {}
        members.forEach(m => newStatus[m.id] = status)
        setAttendance(newStatus)
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                date: new Date(date).toISOString(),
                type: "SUNDAY_SERVICE",
                records: Object.entries(attendance).map(([userId, status]) => {
                    const member = members.find(m => m.id === userId)
                    return {
                        memberId: member?.profile.id,
                        status
                    }
                }).filter(r => r.memberId)
            }

            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                alert("Attendance logged successfully!")
            } else {
                alert("Failed to log attendance.")
            }
        } catch (e) {
            console.error(e)
            alert("Error submitting.")
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Logging</h2>
                    <p className="text-muted-foreground">Record daily attendance for members.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Label>Date: </Label>
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
            </div>

            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setAll("PRESENT")}>Mark All Present</Button>
                <Button size="sm" variant="outline" onClick={() => setAll("ABSENT")}>Mark All Absent</Button>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member Name</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                            members.map(m => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">
                                        {m.profile.firstName} {m.profile.lastName}
                                    </TableCell>
                                    <TableCell className="flex justify-center gap-4">
                                        {["PRESENT", "ABSENT", "EXCUSED"].map(status => (
                                            <div key={status} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`status-${m.id}`}
                                                    checked={attendance[m.id] === status}
                                                    onChange={() => handleStatusChange(m.id, status)}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm capitalize">{status.toLowerCase()}</span>
                                            </div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSubmit}>Save Attendance</Button>
            </div>
        </div>
    )
}
