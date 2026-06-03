"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!")
            return
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })

            const data = await res.json()

            if (res.ok) {
                alert("Password changed successfully! Please log in again.")
                router.push("/api/auth/signout")
            } else {
                alert(data.error || "Failed to change password")
            }
        } catch (error) {
            console.error(error)
            alert("Error changing password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input
                                id="current"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input
                                id="new"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm New Password</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Changing..." : "Change Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
