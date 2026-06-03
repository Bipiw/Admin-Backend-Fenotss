"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, XCircle, Minus, Search, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ETHIOPIAN_MONTHS } from "@/lib/constants"

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const currentYear = new Date().getFullYear()

type MonthStatus = "PAID" | "PENDING" | "OVERDUE" | "UNPAID"

function StatusCell({ status, onClick, loading }: { status: MonthStatus; onClick: () => void; loading: boolean }) {
    const map: Record<MonthStatus, { icon: any; cls: string; next: string }> = {
        PAID:    { icon: <CheckCircle2 className="h-4 w-4" />, cls: "bg-green-100 text-green-700 hover:bg-green-200 border-green-300", next: "PENDING" },
        PENDING: { icon: <Minus className="h-4 w-4" />,        cls: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300", next: "OVERDUE" },
        OVERDUE: { icon: <XCircle className="h-4 w-4" />,      cls: "bg-red-100 text-red-700 hover:bg-red-200 border-red-300", next: "PAID" },
        UNPAID:  { icon: <Minus className="h-4 w-4 opacity-30" />, cls: "bg-gray-50 text-gray-400 hover:bg-gray-100 border-gray-200", next: "PAID" },
    }
    const c = map[status] || map.UNPAID
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={onClick}
                        disabled={loading}
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${c.cls} ${loading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                    >
                        {c.icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{status} — click to → {c.next}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default function FinanceLedgerPage() {
    const [year, setYear] = useState(String(currentYear))
    const [ledger, setLedger] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string>("")
    const [search, setSearch] = useState("")

    const fetchLedger = useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/finance/ledger?year=${year}`)
        const data = await res.json()
        if (data.ledger) setLedger(data.ledger)
        setLoading(false)
    }, [year])

    useEffect(() => { fetchLedger() }, [fetchLedger])

    const cycleStatus = async (memberId: string, monthIndex: number, currentStatus: MonthStatus) => {
        const nextMap: Record<MonthStatus, MonthStatus> = {
            UNPAID: "PAID", PAID: "PENDING", PENDING: "OVERDUE", OVERDUE: "PAID"
        }
        const newStatus = nextMap[currentStatus]
        const key = `${memberId}-${monthIndex}`
        setUpdating(key)

        try {
            const res = await fetch("/api/finance/ledger", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId, month: monthIndex, year: parseInt(year), status: newStatus }),
            })
            if (res.ok) {
                setLedger(prev => prev.map(row => {
                    if (row.member.id !== memberId) return row
                    return {
                        ...row,
                        months: row.months.map((m: any, i: number) =>
                            i === monthIndex ? { ...m, status: newStatus } : m
                        )
                    }
                }))
            } else toast.error("Failed to update payment")
        } catch { toast.error("Network error") }
        finally { setUpdating("") }
    }

    const filtered = ledger.filter(row =>
        `${row.member.firstName} ${row.member.lastName}`.toLowerCase().includes(search.toLowerCase())
    )

    // Stats
    const allCells = ledger.flatMap(row => row.months)
    const paid = allCells.filter((m: any) => m.status === "PAID").length
    const overdue = allCells.filter((m: any) => m.status === "OVERDUE").length
    const pending = allCells.filter((m: any) => m.status === "PENDING").length
    const total = allCells.length
    const complianceRate = total > 0 ? Math.round((paid / total) * 100) : 0

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Monthly Payment Ledger</h2>
                    <p className="text-muted-foreground">Track monthly contributions for all members. Click any cell to cycle its status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={fetchLedger} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{paid}</div>
                        <div className="text-xs text-muted-foreground">Paid</div>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{pending}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{overdue}</div>
                        <div className="text-xs text-muted-foreground">Overdue</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">{complianceRate}%</div>
                        <div className="text-xs text-muted-foreground">Compliance</div>
                    </CardContent>
                </Card>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="font-medium">Legend:</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Paid</span>
                <span className="flex items-center gap-1"><Minus className="h-3.5 w-3.5 text-yellow-600" /> Pending</span>
                <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-red-600" /> Overdue</span>
                <span className="flex items-center gap-1"><Minus className="h-3.5 w-3.5 text-gray-300" /> Not Recorded</span>
                <span className="ml-2 italic">Click any cell to cycle its status</span>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search member..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Ledger Grid */}
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium sticky left-0 bg-muted/50 min-w-[180px]">Member</th>
                                {MONTHS_EN.map((m, i) => (
                                    <th key={i} className="px-1 py-3 font-medium text-center min-w-[40px]">
                                        <div className="text-xs">{m}</div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 font-medium text-center">Paid / 12</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={14} className="text-center py-12 text-muted-foreground">Loading ledger...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={14} className="text-center py-12 text-muted-foreground">No members found.</td></tr>
                            ) : filtered.map(row => {
                                const paidCount = row.months.filter((m: any) => m.status === "PAID").length
                                return (
                                    <tr key={row.member.id} className="border-b hover:bg-muted/20">
                                        <td className="px-4 py-2 sticky left-0 bg-background font-medium">
                                            <div>{row.member.firstName} {row.member.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{row.member.department}</div>
                                        </td>
                                        {row.months.map((month: any, i: number) => {
                                            const key = `${row.member.id}-${i}`
                                            return (
                                                <td key={i} className="px-1 py-2 text-center">
                                                    <StatusCell
                                                        status={month.status}
                                                        onClick={() => cycleStatus(row.member.id, i, month.status)}
                                                        loading={updating === key}
                                                    />
                                                </td>
                                            )
                                        })}
                                        <td className="px-4 py-2 text-center">
                                            <Badge
                                                variant={paidCount === 12 ? "default" : paidCount >= 6 ? "secondary" : "destructive"}
                                                className="text-xs"
                                            >
                                                {paidCount}/12
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}
