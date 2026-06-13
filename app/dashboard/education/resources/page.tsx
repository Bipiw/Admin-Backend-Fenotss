"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Link as LinkIcon, Video, Bell, BookOpen, Plus, Send } from "lucide-react"

export default function EducationResourcesPage() {
    const [activeTab, setActiveTab] = useState<"materials" | "announcements">("materials")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<{ notifications: any[]; materials: any[] }>({ notifications: [], materials: [] })

    // Study material form state
    const [materialTitle, setMaterialTitle] = useState("")
    const [materialUrl, setMaterialUrl] = useState("")
    const [materialFormat, setMaterialFormat] = useState("LINK")
    const [materialDesc, setMaterialDesc] = useState("")
    const [submittingMaterial, setSubmittingMaterial] = useState(false)

    // Announcement form state
    const [announceTitle, setAnnounceTitle] = useState("")
    const [announceCategory, setAnnounceCategory] = useState("INFO")
    const [announceContent, setAnnounceContent] = useState("")
    const [submittingAnnounce, setSubmittingAnnounce] = useState(false)

    const fetchResources = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/resources")
            if (res.ok) {
                const resData = await res.json()
                setData(resData)
            }
        } catch (err) {
            console.error("Failed to fetch resources:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResources()
    }, [])

    const handleCreateMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!materialTitle || !materialUrl) return alert("Title and URL are required.")

        setSubmittingMaterial(true)
        try {
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "STUDY_MATERIAL",
                    title: materialTitle,
                    url: materialUrl,
                    format: materialFormat,
                    description: materialDesc,
                }),
            })

            if (res.ok) {
                alert("Study Material created successfully!")
                setMaterialTitle("")
                setMaterialUrl("")
                setMaterialFormat("LINK")
                setMaterialDesc("")
                fetchResources()
            } else {
                alert("Failed to create study material.")
            }
        } catch (err) {
            console.error(err)
            alert("Error creating study material.")
        } finally {
            setSubmittingMaterial(false)
        }
    }

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!announceTitle || !announceContent) return alert("Title and Content are required.")

        setSubmittingAnnounce(true)
        try {
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "NOTIFICATION",
                    title: announceTitle,
                    content: announceContent,
                    category: announceCategory,
                }),
            })

            if (res.ok) {
                alert("Announcement published successfully!")
                setAnnounceTitle("")
                setAnnounceContent("")
                setAnnounceCategory("INFO")
                fetchResources()
            } else {
                alert("Failed to publish announcement.")
            }
        } catch (err) {
            console.error(err)
            alert("Error publishing announcement.")
        } finally {
            setSubmittingAnnounce(false)
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Study Resources & Announcements</h2>
                <p className="text-muted-foreground">Manage and publish study guides, files, links, and notifications for Sunday School members.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    className={`py-2 px-4 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === "materials"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("materials")}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Study Materials
                    </div>
                </button>
                <button
                    className={`py-2 px-4 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === "announcements"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("announcements")}
                >
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        System Announcements
                    </div>
                </button>
            </div>

            {activeTab === "materials" ? (
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Add material form */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-primary" />
                                    Add Study Material
                                </CardTitle>
                                <CardDescription>Publish a new study guide or document for students.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateMaterial} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            placeholder="e.g. Dogmatic Theology Introduction"
                                            value={materialTitle}
                                            onChange={e => setMaterialTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Format / Type</Label>
                                        <Select value={materialFormat} onValueChange={setMaterialFormat}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PDF">PDF Document</SelectItem>
                                                <SelectItem value="VIDEO">Video Link</SelectItem>
                                                <SelectItem value="LINK">External Website Link</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Resource URL</Label>
                                        <Input
                                            placeholder="e.g. https://drive.google.com/..."
                                            value={materialUrl}
                                            onChange={e => setMaterialUrl(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                            placeholder="Briefly describe the study material contents..."
                                            value={materialDesc}
                                            onChange={e => setMaterialDesc(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={submittingMaterial}>
                                        {submittingMaterial ? "Uploading..." : "Publish Material"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Materials list */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-semibold">Published Materials</h3>
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading materials...</p>
                        ) : data.materials.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No study materials published yet.</p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {data.materials.map((m: any) => (
                                    <Card key={m.id} className="hover:bg-muted/50 transition-colors">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 shrink-0">
                                                    {m.type === "PDF" ? (
                                                        <FileText className="h-5 w-5 text-red-500" />
                                                    ) : m.type === "VIDEO" ? (
                                                        <Video className="h-5 w-5 text-blue-500" />
                                                    ) : (
                                                        <LinkIcon className="h-5 w-5 text-green-500" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <CardTitle className="text-base text-blue-600 hover:underline break-words">
                                                        <a href={m.url} target="_blank" rel="noopener noreferrer">
                                                            {m.title}
                                                        </a>
                                                    </CardTitle>
                                                    <CardDescription className="text-xs mt-1">
                                                        Published on {new Date(m.createdAt).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        {m.description && (
                                            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                                <p className="line-clamp-2">{m.description}</p>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Add announcement form */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Send className="h-5 w-5 text-primary" />
                                    Publish Announcement
                                </CardTitle>
                                <CardDescription>Send a notification or update to the entire Sunday School.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            placeholder="e.g. Next Week Class Cancellation"
                                            value={announceTitle}
                                            onChange={e => setAnnounceTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={announceCategory} onValueChange={setAnnounceCategory}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INFO">General Information</SelectItem>
                                                <SelectItem value="ALERT">Alert / Warning</SelectItem>
                                                <SelectItem value="ACADEMIC">Academic Update</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Content</Label>
                                        <Textarea
                                            placeholder="Type the announcement message details here..."
                                            value={announceContent}
                                            onChange={e => setAnnounceContent(e.target.value)}
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={submittingAnnounce}>
                                        {submittingAnnounce ? "Sending..." : "Publish Announcement"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Announcements list */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-semibold">Published Announcements</h3>
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading announcements...</p>
                        ) : data.notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No announcements published yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {data.notifications.map((n: any) => (
                                    <Card key={n.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <CardTitle className="text-base">{n.title}</CardTitle>
                                                    <CardDescription className="text-xs mt-1">
                                                        Sent on {new Date(n.createdAt).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                                                    n.type === "ALERT" 
                                                        ? "bg-red-500/10 text-red-600 border-red-500/20" 
                                                        : n.type === "ACADEMIC"
                                                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                        : "bg-green-500/10 text-green-600 border-green-500/20"
                                                }`}>
                                                    {n.type}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
