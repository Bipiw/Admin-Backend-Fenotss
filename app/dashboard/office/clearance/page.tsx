"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, Search, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const DEPARTURE_REASONS = [
    "Completed Sunday School Program",
    "Transferred to Another Church",
    "Personal Reasons",
    "Relocated",
    "Graduated",
    "Other",
]

export default function OfficeClearancePage() {
    const [members, setMembers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<any>(null)
    const [reason, setReason] = useState("")
    const [customReason, setCustomReason] = useState("")
    const [notes, setNotes] = useState("")
    const [saving, setSaving] = useState(false)
    const [issuedRecord, setIssuedRecord] = useState<any>(null)
    const [recentClearances, setRecentClearances] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch("/api/users").then(r => r.json()),
            fetch("/api/office/clearance").then(r => r.json()),
        ]).then(([users, clearances]) => {
            if (Array.isArray(users)) setMembers(users.filter((u: any) => u.role === "MEMBER"))
            if (Array.isArray(clearances)) setRecentClearances(clearances)
        }).finally(() => setLoading(false))
    }, [])

    const filtered = members.filter(m =>
        (`${m.profile?.firstName} ${m.profile?.lastName}`).toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8)

    const handleIssue = async () => {
        if (!selected) return toast.error("Please select a member.")
        const finalReason = reason === "Other" ? customReason : reason
        if (!finalReason) return toast.error("Please provide a reason.")

        setSaving(true)
        try {
            const res = await fetch("/api/office/clearance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId: selected.profile.id, reason: finalReason, notes }),
            })
            const data = await res.json()
            if (res.ok) {
                setIssuedRecord(data)
                setRecentClearances(prev => [data, ...prev])
                toast.success("Clearance issued successfully!")
            } else {
                toast.error(data.error || "Failed to issue clearance")
            }
        } catch { toast.error("Network error") }
        finally { setSaving(false) }
    }

    const printClearance = (record: any) => {
        const member = record.member || selected?.profile
        const name = member ? `${member.firstName} ${member.lastName}` : "Member"
        const dept = member?.department || selected?.profile?.department || ""
        const email = record.member?.user?.email || selected?.email || ""
        const issueDate = new Date(record.issuedAt || Date.now()).toLocaleDateString("en-ET", {
            year: "numeric", month: "long", day: "numeric"
        })
        const issuer = record.issuedBy?.email || ""

        // Generate Academic Table
        const academicsList = member?.academics || []
        const academicsTable = academicsList.length > 0
            ? `
            <div class="section-title">Academic Record Summary / የትምህርት አፈጻጸም ማጠቃለያ</div>
            <table class="history-table">
              <thead>
                <tr>
                  <th>Subject / ትምህርት</th>
                  <th>Year / አመተ ምህረት</th>
                  <th>Semester / ወሰነ ትምህርት</th>
                  <th>Score / ውጤት</th>
                </tr>
              </thead>
              <tbody>
                ${academicsList.map((g: any) => `
                  <tr>
                    <td>${g.subjectName || "General Course"}</td>
                    <td>${g.year}</td>
                    <td>${g.semester || "1st"}</td>
                    <td><strong>${g.examScore}/${g.totalScore}</strong> ${g.gradeLabel ? `(${g.gradeLabel})` : ""}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            `
            : `
            <div class="section-title">Academic Record Summary / የትምህርት አፈጻጸም ማጠቃለያ</div>
            <p class="empty-text">No active academic records registered for this member.</p>
            `

        // Generate Financial Table
        const financialsList = member?.financials || []
        const financialsTable = financialsList.length > 0
            ? `
            <div class="section-title">Financial Clearance Ledger / የገንዘብ ክፍያ ማጠቃለያ</div>
            <table class="history-table">
              <thead>
                <tr>
                  <th>Date / ቀን</th>
                  <th>Payment Type / መግለጫ</th>
                  <th>Amount / መጠን</th>
                  <th>Status / ሁኔታ</th>
                </tr>
              </thead>
              <tbody>
                ${financialsList.slice(0, 5).map((f: any) => `
                  <tr>
                    <td>${new Date(f.date).toLocaleDateString()}</td>
                    <td>${f.type}</td>
                    <td>${parseFloat(f.amount).toFixed(2)} ETB</td>
                    <td><span class="status-badge status-${f.status.toLowerCase()}">${f.status}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            `
            : `
            <div class="section-title">Financial Clearance Ledger / የገንዘብ ክፍያ ማጠቃለያ</div>
            <p class="empty-text">No contribution records registered for this member.</p>
            `

        // Service & Attendance Status
        const eligibility = member?.eligibility
        const eligibilityStatus = eligibility?.status || "PENDING"
        const attendanceRate = eligibility?.attendanceRate !== null && eligibility?.attendanceRate !== undefined
            ? `${Math.round(eligibility.attendanceRate)}%`
            : "N/A"
        const eligibilitySection = `
        <div class="section-title">Service Eligibility & Attendance / የአገልግሎት ሁኔታ ማጠቃለያ</div>
        <div class="eligibility-grid">
          <div class="eligibility-card">
            <span class="card-label">Eligibility Status / የአገልግሎት ምድብ:</span>
            <span class="status-badge status-${eligibilityStatus.toLowerCase()}">${eligibilityStatus}</span>
          </div>
          <div class="eligibility-card">
            <span class="card-label">Attendance Rate / የገደብ ምጣኔ:</span>
            <strong class="card-value">${attendanceRate}</strong>
          </div>
        </div>
        `

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Official Clearance Certificate - ${name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Noto Sans Ethiopic', 'Georgia', serif; padding: 50px; color: #001333; background: #fff; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px double #ffab00; padding-bottom: 20px; margin-bottom: 24px; }
    .header h1 { font-size: 26px; color: #001333; letter-spacing: 2px; text-transform: uppercase; }
    .header h2 { font-size: 14px; font-weight: normal; color: #555; margin-top: 6px; }
    .cert-title { text-align: center; font-size: 22px; font-weight: bold; color: #ffab00; margin-bottom: 20px; letter-spacing: 1px; }
    .body-text { font-size: 14px; line-height: 1.8; color: #333; margin-bottom: 20px; text-align: justify; }
    .field { display: flex; margin-bottom: 8px; font-size: 14px; }
    .field-label { font-weight: bold; min-width: 200px; color: #001333; }
    .field-value { flex: 1; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
    
    .section-title { font-size: 13px; font-weight: bold; color: #001333; margin-top: 24px; margin-bottom: 10px; border-bottom: 2px solid #ffab00; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .history-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    .history-table th, .history-table td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
    .history-table th { background-color: #f8fafc; color: #001333; }
    .empty-text { font-style: italic; font-size: 12px; color: #64748b; margin-bottom: 16px; }
    
    .eligibility-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .eligibility-card { padding: 10px 14px; border: 1px solid #e2e8f0; background-color: #f8fafc; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
    .card-label { color: #64748b; }
    .card-value { color: #001333; font-size: 14px; }
    
    .status-badge { font-weight: bold; font-size: 10px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; display: inline-block; }
    .status-paid { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .status-pending { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .status-overdue { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .status-eligible { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .status-ineligible { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    
    .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
    .sig-box { text-align: center; width: 180px; }
    .sig-line { border-top: 1px solid #333; margin-bottom: 6px; }
    .sig-label { font-size: 11px; color: #555; }
    
    .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    .seal { width: 60px; height: 60px; border-radius: 50%; border: 3px solid #ffab00; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #ffab00; font-weight: bold; }
    @media print { body { padding: 20px; font-size: 12px; } .signature-section { margin-top: 30px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="seal">✞</div>
    <h1>Fenot Sunday Church School</h1>
    <h2>Office of Administration · ጽ/ቤት</h2>
  </div>

  <div class="cert-title">OFFICIAL CLEARANCE CERTIFICATE<br><span style="font-size:14px;color:#333;">የልቀቃ እና አስተዳደራዊ ማጠቃለያ ምስክር ወረቀት</span></div>

  <p class="body-text">
    This document serves as an official certification that the member specified below has been formally cleared from active enrollment in the Sunday Church School program. Their complete academic records, service eligibility standing, and financial contributions history are consolidated below for administrative verification and future reference.
  </p>

  <div class="field"><span class="field-label">Full Name / ሙሉ ስም:</span><span class="field-value"><strong>${name}</strong></span></div>
  <div class="field"><span class="field-label">Department / ክፍል:</span><span class="field-value">${dept}</span></div>
  <div class="field"><span class="field-label">Email / ኢሜይል:</span><span class="field-value">${email}</span></div>
  <div class="field"><span class="field-label">Reason for Departure / ምክንያት:</span><span class="field-value"><strong>${record.reason}</strong></span></div>
  ${record.notes ? `<div class="field"><span class="field-label">Notes / ማስታወሻ:</span><span class="field-value">${record.notes}</span></div>` : ""}
  
  ${eligibilitySection}
  ${academicsTable}
  ${financialsTable}

  <div class="field" style="margin-top:20px;"><span class="field-label">Date Issued / ቀን:</span><span class="field-value">${issueDate}</span></div>
  <div class="field"><span class="field-label">Authorized Officer / ያጸደቀው ኃላፊ:</span><span class="field-value">${issuer}</span></div>

  <div class="signature-section">
    <div class="sig-box">
      <div style="height:35px;"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Member Signature / የአባሉ ፊርማ</div>
    </div>
    <div class="sig-box">
      <div style="height:35px;"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Office Authorized Signature</div>
    </div>
    <div class="sig-box">
      <div style="height:35px;"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Official Stamp / ማህተም</div>
    </div>
  </div>

  <div class="footer">
    Fenot Sunday Church School Management System &nbsp;|&nbsp; Verification Document ID: ${record.id?.slice(0, 8).toUpperCase() || "N/A"}
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`

        const win = window.open("", "_blank")
        if (win) { win.document.write(html); win.document.close() }
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Clearance & Offboarding</h2>
                <p className="text-muted-foreground">Issue leaving certificates for departing members.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Issue Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Issue Clearance</CardTitle>
                        <CardDescription>Search for the member and fill in the departure details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Member Search */}
                        <div className="space-y-2">
                            <Label>Search Member</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Name or email..."
                                    className="pl-9"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setSelected(null) }}
                                />
                            </div>
                            {search && !selected && (
                                <div className="border rounded-md overflow-hidden">
                                    {filtered.length === 0 ? (
                                        <p className="p-3 text-sm text-muted-foreground">No results.</p>
                                    ) : (
                                        filtered.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => { setSelected(m); setSearch(`${m.profile?.firstName} ${m.profile?.lastName}`) }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex justify-between items-center"
                                            >
                                                <span>{m.profile?.firstName} {m.profile?.lastName}</span>
                                                <span className="text-muted-foreground text-xs">{m.profile?.department}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                            {selected && (
                                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-md px-3 py-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">{selected.profile?.firstName} {selected.profile?.lastName}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">{selected.profile?.department}</span>
                                </div>
                            )}
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <Label>Reason for Departure</Label>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger><SelectValue placeholder="Select reason..." /></SelectTrigger>
                                <SelectContent>
                                    {DEPARTURE_REASONS.map(r => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {reason === "Other" && (
                                <Input
                                    placeholder="Specify reason..."
                                    value={customReason}
                                    onChange={e => setCustomReason(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label>Additional Notes (Optional)</Label>
                            <Textarea
                                placeholder="Any additional remarks..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <Button
                            onClick={handleIssue}
                            disabled={saving || !selected || !reason}
                            className="w-full"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            {saving ? "Issuing..." : "Issue Clearance Certificate"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Clearances */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Clearances</CardTitle>
                        <CardDescription>Previously issued clearance certificates.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Print</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-6">Loading...</TableCell></TableRow>
                                ) : recentClearances.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No clearances issued yet.</TableCell></TableRow>
                                ) : (
                                    recentClearances.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">
                                                {c.member?.firstName} {c.member?.lastName}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">
                                                {c.reason}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(c.issuedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" onClick={() => printClearance(c)}>
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Print Preview Dialog */}
            {issuedRecord && (
                <Dialog open={!!issuedRecord} onOpenChange={() => setIssuedRecord(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" /> Clearance Issued Successfully
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                            <p className="text-muted-foreground">
                                The clearance certificate for <strong>{selected?.profile?.firstName} {selected?.profile?.lastName}</strong> has been recorded.
                            </p>
                            <div className="bg-muted/50 rounded-md p-3 space-y-1">
                                <div><span className="font-medium">Reason:</span> {issuedRecord.reason}</div>
                                <div><span className="font-medium">Date:</span> {new Date(issuedRecord.issuedAt).toLocaleDateString()}</div>
                                <div><span className="font-medium">Record ID:</span> {issuedRecord.id?.slice(0, 8).toUpperCase()}</div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIssuedRecord(null)}>Close</Button>
                            <Button onClick={() => printClearance(issuedRecord)}>
                                <Printer className="mr-2 h-4 w-4" /> Print Certificate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
