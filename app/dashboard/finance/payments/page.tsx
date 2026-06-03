"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, Search } from "lucide-react"

interface Member {
    id: string
    email: string
    profile: {
        id: string
        firstName: string
        lastName: string
    }
}

export default function PaymentEntryPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [selectedMember, setSelectedMember] = useState<string>("")
    const [amount, setAmount] = useState("200")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)

    const [receiptRef, setReceiptRef] = useState("")

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    setMembers(data.filter(u => u.role === 'MEMBER'))
                } else {
                    console.error("Failed to fetch users:", data)
                    setMembers([])
                }
            })
            .catch(err => {
                console.error("Error fetching users:", err)
                setMembers([])
            })
    }, [])

    const [receiptFile, setReceiptFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMember) return alert("Select a member")

        setLoading(true)
        try {
            const member = members.find(m => m.id === selectedMember)
            if (!member || !member.profile?.id) throw new Error("Invalid member")

            const formData = new FormData()
            formData.append('memberId', member.profile.id)
            formData.append('amount', amount)
            formData.append('type', 'MONTHLY_CONTRIBUTION')
            formData.append('status', 'PAID')
            formData.append('description', description || `Monthly Contribution`)
            formData.append('verified', 'true')

            if (receiptRef) formData.append('receiptRef', receiptRef)
            if (receiptFile) formData.append('receipt', receiptFile)

            const res = await fetch("/api/finance", {
                method: "POST",
                body: formData
            })

            if (res.ok) {
                alert("Payment recorded!")
                setDescription("")
                setReceiptRef("")
                setReceiptFile(null)
                // Clear file input manually if needed or reset form
            } else {
                alert("Failed to record payment")
            }
        } catch (error) {
            console.error(error)
            alert("Error submitting")
        } finally {
            setLoading(false)
        }
    }

    // Simple filter for search
    const [searchTerm, setSearchTerm] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const filteredMembers = members.filter(m =>
        (m.profile?.firstName + " " + m.profile?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.includes(searchTerm)
    )

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Record Payment</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Manual Transaction Entry</CardTitle>
                    <CardDescription>Enter payment details and receipt reference.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Find Member</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={e => {
                                        setSearchTerm(e.target.value)
                                        setShowDropdown(true)
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                />
                                {showDropdown && searchTerm && filteredMembers.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                                        {filteredMembers.map(m => (
                                            <div
                                                key={m.id}
                                                className={`p-3 cursor-pointer hover:bg-slate-100 flex justify-between items-center ${selectedMember === m.id ? "bg-slate-50 font-medium" : ""}`}
                                                onClick={() => {
                                                    setSelectedMember(m.id)
                                                    setSearchTerm(m.profile.firstName + " " + m.profile.lastName)
                                                    setShowDropdown(false)
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{m.profile.firstName} {m.profile.lastName}</span>
                                                    <span className="text-xs text-muted-foreground">{m.email}</span>
                                                </div>
                                                {selectedMember === m.id && <Check className="h-4 w-4 text-green-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showDropdown && searchTerm && filteredMembers.length === 0 && (
                                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg p-4 text-center text-muted-foreground text-sm">
                                        No members found.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Amount (ETB)</Label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Receipt Ref / No. (Optional)</Label>
                                <Input
                                    placeholder="e.g. RCP-001"
                                    value={receiptRef}
                                    onChange={e => setReceiptRef(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Upload Receipt (Image/PDF)</Label>
                            <Input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={e => setReceiptFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description / Month</Label>
                            <Input
                                placeholder="e.g. September 2024"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Processing..." : "Verify & Record Payment"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
