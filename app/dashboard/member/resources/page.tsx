"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BookOpen, FileText, Link as LinkIcon, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ResourcesPage() {
    const [data, setData] = useState<{ notifications: any[], materials: any[] }>({ notifications: [], materials: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/resources")
            .then(res => res.json())
            .then(resData => {
                setData(resData)
                setLoading(false)
            })
            .catch(err => setLoading(false))
    }, [])

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Resources & Updates</h2>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Notifications Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Notifications</h3>
                    </div>
                    {loading ? <p>Loading...</p> : data.notifications.length === 0 ? <p className="text-muted-foreground">No new notifications.</p> : (
                        <div className="space-y-4">
                            {data.notifications.map((n: any) => (
                                <Card key={n.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between">
                                            <CardTitle className="text-base">{n.title}</CardTitle>
                                            <Badge variant="outline">{n.type}</Badge>
                                        </div>
                                        <CardDescription>{new Date(n.createdAt).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{n.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Study Materials Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Study Materials</h3>
                    </div>
                    {loading ? <p>Loading...</p> : data.materials.length === 0 ? <p className="text-muted-foreground">No materials uploaded yet.</p> : (
                        <div className="grid gap-4">
                            {data.materials.map((m: any) => (
                                <Card key={m.id} className="hover:bg-slate-50 transition-colors">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                {m.type === 'PDF' ? <FileText className="h-5 w-5 text-red-500" /> :
                                                    m.type === 'VIDEO' ? <Video className="h-5 w-5 text-blue-500" /> :
                                                        <LinkIcon className="h-5 w-5 text-green-500" />}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base text-blue-600 hover:underline">
                                                    <a href={m.url} target="_blank" rel="noopener noreferrer">{m.title}</a>
                                                </CardTitle>
                                                <CardDescription className="mt-1">{m.description || "No description"}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
