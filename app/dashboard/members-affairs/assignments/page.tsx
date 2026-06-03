"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssignmentManagerPage() {
    const [members, setMembers] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => {
                // Filter for unassigned members
                if (Array.isArray(data)) {
                    const unassigned = data.filter((u: any) => u.role === 'MEMBER' && u.profile?.department === 'OTHER')
                    setMembers(unassigned)
                } else {
                    console.error("Failed to fetch members:", data)
                    setMembers([])
                }
            })
            .catch(err => {
                console.error(err)
                setMembers([])
            })
    }, [])

    const handleAssign = async (userId: string, department: string) => {
        const res = await fetch("/api/members/assign", {
            method: "POST",
            body: JSON.stringify({ userId, department })
        })
        if (res.ok) {
            // Remove from list
            setMembers(prev => prev.filter(m => m.id !== userId))
            alert("Member assigned successfully!")
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Assignment Manager</h2>
                <p className="text-muted-foreground">Assign active members to service departments.</p>
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member Name</TableHead>
                            <TableHead>Current Status</TableHead>
                            <TableHead>Assign To</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length === 0 ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-8">No unassigned members found.</TableCell></TableRow>
                        ) : (
                            members.map(m => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">
                                        {m.profile?.firstName} {m.profile?.lastName}
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">Unassigned</Badge></TableCell>
                                    <TableCell>
                                        <Select onValueChange={(val) => handleAssign(m.id, val)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CHOIR">Choir</SelectItem>
                                                <SelectItem value="SUNDAY_SCHOOL">Sunday School</SelectItem>
                                                <SelectItem value="DEACONS">Deacons</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
