"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/finance")
            .then(res => res.json())
            .then(data => setTransactions(data))
    }, [])

    return (
        <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Member</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Recorded By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                <TableCell>{t.member.firstName} {t.member.lastName}</TableCell>
                                <TableCell>{t.type}</TableCell>
                                <TableCell>{t.amount} ETB</TableCell>
                                <TableCell>{t.recordedBy.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
