"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function MyFinancePage() {
    const [records, setRecords] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/finance")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setRecords(data)
                else setRecords([])
            })
            .catch(err => setRecords([]))
    }, [])

    return (
        <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Payment History</h2>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8">No payment records found.</TableCell></TableRow>
                        ) : (
                            records.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{r.description || r.type.replace('_', ' ')}</TableCell>
                                    <TableCell>{r.amount} ETB</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{r.status}</Badge>
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
