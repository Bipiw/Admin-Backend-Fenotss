"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Megaphone, Trash2, Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

interface Announcement {
    id: string
    title: string
    content: string
    expiresAt: string | null
}

export function AnnouncementManager() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ title: "", content: "", expiresAt: "" })

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = () => {
        fetch("/api/announcements")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAnnouncements(data)
            })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsOpen(false)
                setFormData({ title: "", content: "", expiresAt: "" })
                fetchAnnouncements()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this announcement?")) return
        try {
            await fetch(`/api/announcements/${id}`, { method: "DELETE" })
            fetchAnnouncements()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Announcements</CardTitle>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Announcement</DialogTitle>
                            <DialogDescription>
                                Post a message to all users.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expires At (Optional)</Label>
                                <Input
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Posting..." : "Post Announcement"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No active announcements</p>
                    ) : (
                        announcements.map(a => (
                            <div key={a.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-sm">{a.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 h-8 w-8"
                                    onClick={() => handleDelete(a.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
