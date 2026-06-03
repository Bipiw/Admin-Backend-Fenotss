"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Phone, MapPin, Mail, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: ""
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile")
            if (res.ok) {
                const data = await res.json()
                setProfile(data)
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    address: data.address
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                const updated = await res.json()
                setProfile({ ...profile, ...updated }) // Optimistic update or refetch
                await fetchProfile() // Refetch to be sure
                setIsEditing(false)
                alert("Profile updated successfully!")
            } else {
                alert("Failed to update profile")
            }
        } catch (error) {
            console.error(error)
            alert("Error saving")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    if (!profile) return <div className="p-8">Failed to load profile.</div>

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{profile.firstName} {profile.lastName}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{profile.email}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{profile.role}</Badge>
                        <Badge variant="outline">{profile.department}</Badge>
                    </div>
                </div>
                <div className="ml-auto">
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)} variant="outline">Edit Profile</Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input disabled value={profile.email} className="bg-slate-50" />
                                <p className="text-xs text-muted-foreground">Contact admin to change email.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-8"
                                        disabled={!isEditing}
                                        placeholder="+251..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-8"
                                        disabled={!isEditing}
                                        placeholder="City, Sub-city..."
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={saving}>
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => {
                                        setIsEditing(false)
                                        setFormData({
                                            firstName: profile.firstName,
                                            lastName: profile.lastName,
                                            phone: profile.phone,
                                            address: profile.address
                                        })
                                    }}>Cancel</Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Account Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>Your membership and department details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-sm text-muted-foreground">Membership Status</p>
                                <p className="font-bold text-green-600">Active</p>
                            </div>
                            <User className="h-8 w-8 text-slate-300" />
                        </div>
                        <div className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-sm text-muted-foreground">Department</p>
                                <p className="font-bold">{profile.department}</p>
                            </div>
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                {profile.department[0]}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
