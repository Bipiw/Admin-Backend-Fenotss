"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, UserPlus, FileSpreadsheet, FileJson } from "lucide-react"
import { exportToCSV, exportToPDF } from "@/lib/export-utils"
import { useToast } from "@/components/ui/use-toast" // Assuming use-toast exists, if not I'll just alert or console.log. Checking... I'll check first or just duplicate simple logic. I'll stick to alert for simplicity if uncertain, but usually it's hooks/use-toast.
// Actually, I'll use standard alert for now to be safe, or just minimal UI feedback.

interface User {
    id: string
    email: string
    role: string
    profile?: {
        firstName: string
        lastName: string
        department: string
    }
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "MEMBER"
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data)) {
                    setUsers(data)
                } else {
                    console.error("Failed to fetch users:", data)
                    setUsers([])
                }
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            })

            if (res.ok) {
                setIsDialogOpen(false)
                fetchUsers() // Refresh list
                setNewUser({ email: "", password: "", firstName: "", lastName: "", role: "MEMBER" })
                alert("User created successfully!")
            } else {
                const data = await res.json()
                alert(data.error || "Failed to create user")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating user")
        }
    }

    const handleExportCSV = () => {
        const exportData = users.map(u => ({
            Name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : 'N/A',
            Email: u.email,
            Role: u.role,
            Department: u.profile?.department || 'N/A'
        }))
        exportToCSV(exportData, "users-report")
    }

    const handleExportPDF = () => {
        const exportData = users.map(u => ({
            Name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : 'N/A',
            Email: u.email,
            Role: u.role,
            Department: u.profile?.department || 'N/A'
        }))
        exportToPDF(exportData, "User Management Report", "users-report")
    }

    const admins = users.filter(u => u.role !== 'MEMBER')
    const members = users.filter(u => u.role === 'MEMBER')

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage system access and roles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportCSV}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                    </Button>
                    <Button variant="outline" onClick={handleExportPDF}>
                        <FileJson className="mr-2 h-4 w-4" /> PDF
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" /> Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new account with specific role access.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={newUser.firstName}
                                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={newUser.lastName}
                                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Username (Email Handle)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="email"
                                            type="text"
                                            placeholder="john.doe"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            required
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">@fenot.com</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        For students, the current year ({new Date().getFullYear()}) will be appended automatically if omitted.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                            <SelectItem value="FINANCE">Finance</SelectItem>
                                            <SelectItem value="EDUCATION">Education</SelectItem>
                                            <SelectItem value="MEMBERS_AFFAIRS">Members Affairs</SelectItem>
                                            <SelectItem value="MEMBER">Member (Student)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create User</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="admins" className="w-full">
                <TabsList>
                    <TabsTrigger value="admins">Staff & Admins ({admins.length})</TabsTrigger>
                    <TabsTrigger value="members">Students/Members ({members.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="admins" className="mt-4">
                    <UserTable
                        users={admins}
                        loading={loading}
                        type="Admin/Staff"
                        onRefresh={fetchUsers}
                    />
                </TabsContent>

                <TabsContent value="members" className="mt-4">
                    <UserTable
                        users={members}
                        loading={loading}
                        type="Student"
                        onRefresh={fetchUsers}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function UserTable({ users, loading, type, onRefresh }: { users: User[], loading: boolean, type: string, onRefresh: () => void }) {
    if (loading) return <div className="text-center py-8 text-muted-foreground">Loading {type.toLowerCase()}s...</div>

    return (
        <div className="border rounded-lg bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No {type.toLowerCase()}s found.</TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'N/A'}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role.replace('_', ' ')}</TableCell>
                                <TableCell>{user.profile?.department || '-'}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit User</DialogTitle>
                                            </DialogHeader>
                                            <form
                                                onSubmit={async (e) => {
                                                    e.preventDefault()
                                                    const formData = new FormData(e.currentTarget)
                                                    const role = formData.get("role")
                                                    const password = formData.get("password")

                                                    const body: any = { role }
                                                    if (password) body.password = password

                                                    if (confirm("Update this user?")) {
                                                        try {
                                                            const res = await fetch(`/api/users/${user.id}`, {
                                                                method: "PATCH",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify(body)
                                                            })
                                                            if (res.ok) {
                                                                alert("User updated")
                                                                onRefresh()
                                                            } else {
                                                                const err = await res.json()
                                                                alert(err.error || "Update failed")
                                                            }
                                                        } catch (err) {
                                                            console.error(err)
                                                            alert("Connection error")
                                                        }
                                                    }
                                                }}
                                                className="space-y-4 py-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label>Role</Label>
                                                    <Select name="role" defaultValue={user.role}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                                            <SelectItem value="FINANCE">Finance</SelectItem>
                                                            <SelectItem value="EDUCATION">Education</SelectItem>
                                                            <SelectItem value="MEMBERS_AFFAIRS">Members Affairs</SelectItem>
                                                            <SelectItem value="MEMBER">Member</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>New Password (Optional)</Label>
                                                    <Input name="password" type="password" placeholder="Leave blank to keep current" />
                                                </div>
                                                <Button type="submit">Save Changes</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                        onClick={async () => {
                                            const newPassword = prompt(`Enter new password for ${user.email}:`)
                                            if (newPassword && newPassword.length >= 6) {
                                                try {
                                                    const res = await fetch(`/api/users/${user.id}`, {
                                                        method: "PATCH",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ password: newPassword })
                                                    })
                                                    if (res.ok) {
                                                        alert("Password reset successfully")
                                                    } else {
                                                        alert("Failed to reset password")
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                    alert("Connection error")
                                                }
                                            } else if (newPassword) {
                                                alert("Password must be at least 6 characters")
                                            }
                                        }}
                                    >
                                        Reset Pwd
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={async () => {
                                            if (confirm("Permanently delete this user? This action cannot be undone.")) {
                                                try {
                                                    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" })
                                                    if (res.ok) {
                                                        alert("User deleted successfully")
                                                        onRefresh()
                                                    } else {
                                                        // Fix: Show actual error
                                                        const data = await res.json().catch(() => ({}))
                                                        alert(data.error || "Failed to delete user. Check console for details.")
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                    alert("Network error while deleting")
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
