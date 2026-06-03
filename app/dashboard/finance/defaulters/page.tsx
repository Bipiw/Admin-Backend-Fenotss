"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Defaulter {
    id: string
    firstName: string
    lastName: string
    email: string
    monthsOverdue: number | string
    lastPaymentDate: string | null
}

export default function DefaultersPage() {
    const [defaulters, setDefaulters] = useState<Defaulter[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/finance/defaulters")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDefaulters(data)
                } else {
                    console.error("Failed to fetch defaulters:", data)
                    setDefaulters([])
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Error fetching defaulters:", err)
                setDefaulters([])
                setLoading(false)
            })
    }, [])

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-red-600">Overdue Payments</h2>
                <p className="text-muted-foreground">Members with outstanding contributions (&gt; 2 months).</p>
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Months Overdue</TableHead>
                            <TableHead>Last Payment</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
                            : defaulters.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8">No defaulters found.</TableCell></TableRow>
                                : defaulters.map(d => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{d.firstName} {d.lastName}</TableCell>
                                        <TableCell>{d.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="destructive">{d.monthsOverdue} Months</Badge>
                                        </TableCell>
                                        <TableCell>{d.lastPaymentDate ? new Date(d.lastPaymentDate).toLocaleDateString() : 'Never'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline">Remind</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
