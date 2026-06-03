"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileJson, Loader2 } from "lucide-react"
import { exportToCSV, exportToPDF } from "@/lib/export-utils"

export function MemberExportButtons() {
    const [loading, setLoading] = useState(false)

    const handleExport = async (format: 'pdf' | 'csv') => {
        setLoading(true)
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const users = await res.json()
                const membersOnly = users.filter((u: any) => u.role === 'MEMBER')
                const exportData = membersOnly.map((u: any) => ({
                    Name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : 'N/A',
                    Email: u.email,
                    Role: u.role,
                    Department: u.profile?.department || 'N/A'
                }))

                if (format === 'csv') {
                    exportToCSV(exportData, "member-list")
                } else {
                    exportToPDF(exportData, "Fenot SS - Member List", "member-list")
                }
            } else {
                alert("Failed to fetch data for export")
            }
        } catch (error) {
            console.error("Export error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileJson className="mr-2 h-4 w-4" />}
                PDF
            </Button>
        </div>
    )
}
