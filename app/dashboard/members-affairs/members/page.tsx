"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, User as UserIcon } from "lucide-react"

export default function MembersDirectoryPage() {
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    // New Member Form
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newMember, setNewMember] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        department: "OTHER"
    })

    const fetchMembers = async () => {
        try {
            const res = await fetch("/api/users")
            const data = await res.json()
            if (Array.isArray(data)) {
                // Filter only MEMBERS if needed
                const memberOnly = data.filter((u: any) => u.role === "MEMBER")
                setMembers(memberOnly)
            } else {
                console.error("Failed to fetch members:", data)
                setMembers([])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newMember,
                    role: "MEMBER"
                })
            })

            if (res.ok) {
                setIsDialogOpen(false)
                fetchMembers()
                setNewMember({ firstName: "", lastName: "", email: "", password: "", phone: "", department: "OTHER" })
                alert("Member created successfully")
            } else {
                alert("Failed to create member")
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Edit Member Form
    const [editMember, setEditMember] = useState<any>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleEditClick = (member: any) => {
        setEditMember({
            id: member.id,
            firstName: member.profile?.firstName || "",
            lastName: member.profile?.lastName || "",
            email: member.email,
            phone: member.profile?.phone || "",
            department: member.profile?.department || "OTHER"
        })
        setIsEditOpen(true)
    }

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/users/${editMember.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: editMember.firstName,
                    lastName: editMember.lastName,
                    phone: editMember.phone,
                    department: editMember.department,
                    password: editMember.password // Optional
                })
            })

            if (res.ok) {
                setIsEditOpen(false)
                fetchMembers()
                setEditMember(null)
                alert("Member updated successfully")
            } else {
                const data = await res.json()
                alert(data.error || "Failed to update member")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const filtered = members.filter(m =>
        (m.profile?.firstName + " " + m.profile?.lastName).toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Member Directory</h2>
                    <p className="text-muted-foreground">Manage all Sunday School members.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Member</DialogTitle>
                            <DialogDescription>Create a new account for a Sunday School member.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input
                                        value={newMember.firstName}
                                        onChange={e => setNewMember({ ...newMember, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input
                                        value={newMember.lastName}
                                        onChange={e => setNewMember({ ...newMember, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Username (Email Handle)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="abebe"
                                        value={newMember.email}
                                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                    />
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">@fenot.com</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Registration year ({new Date().getFullYear()}) will be added automatically.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Initial Password</Label>
                                <Input
                                    type="password"
                                    value={newMember.password}
                                    onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        placeholder="+251..."
                                        value={newMember.phone}
                                        onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select
                                        value={newMember.department}
                                        onValueChange={val => setNewMember({ ...newMember, department: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CHOIR">Choir</SelectItem>
                                            <SelectItem value="SUNDAY_SCHOOL">Sunday School</SelectItem>
                                            <SelectItem value="DEACONS">Deacons</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Member</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Member</DialogTitle>
                        </DialogHeader>
                        {editMember && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input
                                            value={editMember.firstName}
                                            onChange={e => setEditMember({ ...editMember, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input
                                            value={editMember.lastName}
                                            onChange={e => setEditMember({ ...editMember, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input disabled value={editMember.email} className="bg-muted/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password (Optional)</Label>
                                    <Input
                                        type="password"
                                        placeholder="Leave blank to keep"
                                        value={editMember.password || ""}
                                        onChange={e => setEditMember({ ...editMember, password: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={editMember.phone}
                                            onChange={e => setEditMember({ ...editMember, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Select
                                            value={editMember.department}
                                            onValueChange={val => setEditMember({ ...editMember, department: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CHOIR">Choir</SelectItem>
                                                <SelectItem value="SUNDAY_SCHOOL">Sunday School</SelectItem>
                                                <SelectItem value="DEACONS">Deacons</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdate}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8">No members found.</TableCell></TableRow>
                        ) : (
                            filtered.map(m => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-slate-500" />
                                        </div>
                                        {m.profile?.firstName} {m.profile?.lastName}
                                    </TableCell>
                                    <TableCell>{m.email}</TableCell>
                                    <TableCell>{m.profile?.department || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(m)}>Edit</Button>
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
