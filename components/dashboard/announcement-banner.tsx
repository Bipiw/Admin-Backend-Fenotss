"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Megaphone } from "lucide-react"

interface Announcement {
    id: string
    title: string
    content: string
}

export function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])

    useEffect(() => {
        fetch("/api/announcements")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAnnouncements(data)
            })
            .catch(err => console.error(err))
    }, [])

    if (announcements.length === 0) return null

    return (
        <div className="space-y-4 mb-6">
            {announcements.map(a => (
                <Alert key={a.id} className="bg-blue-50 border-blue-200">
                    <Megaphone className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">{a.title}</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        {a.content}
                    </AlertDescription>
                </Alert>
            ))}
        </div>
    )
}
