"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import { formatEthDate } from "@/lib/calendar-utils"

interface EthiopianDateDisplayProps {
    className?: string;
}

export function EthiopianDateDisplay({ className }: EthiopianDateDisplayProps) {
    const [date, setDate] = useState<Date | null>(null)

    useEffect(() => {
        setDate(new Date())
        const timer = setInterval(() => setDate(new Date()), 1000 * 60 * 60) // Update every hour
        return () => clearInterval(timer)
    }, [])

    if (!date) return null

    const gregorianDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const ethiopianDate = formatEthDate(date, "am")

    return (
        <div className={`flex flex-col items-end gap-1 ${className}`}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{gregorianDate}</span>
            </div>
            <div className="text-sm font-semibold text-primary">
                {ethiopianDate}
            </div>
        </div>
    )
}
