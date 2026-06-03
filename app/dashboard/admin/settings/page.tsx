"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState({
        orgName: "Fnote Selam Sunday School",
        logoUrl: "/images/church-logo.png",
        serviceDay: "Sunday",
        serviceTime: "09:00"
    })

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setSettings(prev => ({ ...prev, ...data }))
                }
            })
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            })
            if (res.ok) {
                alert("Settings saved successfully!")
            } else {
                alert("Failed to save settings")
            }
        } catch (error) {
            console.error(error)
            alert("Error saving settings")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                <p className="text-muted-foreground">Configure global organization settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>
                        These details will appear on reports and the public website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input
                                id="orgName"
                                value={settings.orgName}
                                onChange={e => setSettings({ ...settings, orgName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">Logo URL</Label>
                            <Input
                                id="logoUrl"
                                value={settings.logoUrl}
                                onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="serviceDay">Service Day</Label>
                                <Input
                                    id="serviceDay"
                                    value={settings.serviceDay}
                                    onChange={e => setSettings({ ...settings, serviceDay: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="serviceTime">Start Time</Label>
                                <Input
                                    id="serviceTime"
                                    type="time"
                                    value={settings.serviceTime}
                                    onChange={e => setSettings({ ...settings, serviceTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Database Management</CardTitle>
                    <CardDescription>
                        Download a full backup of system data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={() => window.open("/api/admin/backup", "_blank")}>
                        Download Backup (JSON)
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
