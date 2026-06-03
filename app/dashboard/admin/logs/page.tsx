"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AuditLog {
    id: string
    action: string
    details: string
    createdAt: string
    user: {
        email: string
        role: string
        profile: { firstName: string, lastName: string } | null
    }
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/audit-logs")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLogs(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                <p className="text-muted-foreground">Track all system activities and security events.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">Loading logs...</TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">No logs found.</TableCell>
                                </TableRow>
                            ) : (
                                logs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {log.user.profile ? `${log.user.profile.firstName} ${log.user.profile.lastName}` : 'Unknown'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{log.user.role}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono">
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{log.details || '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
