"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { Search, Bell } from "lucide-react"

interface DashboardTopbarProps {
    title: string
    roleLabel: string
}

export function DashboardTopbar({ title, roleLabel }: DashboardTopbarProps) {
    const { data: session } = useSession()
    const userEmail = session?.user?.email || ""
    const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "??"

    return (
        <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-4 border-b bg-background/80 backdrop-blur-sm">
            <SidebarTrigger />
            <h1 className="font-semibold hidden sm:block">{title}</h1>
            <div className="flex-1 max-w-md hidden md:flex items-center ml-4 relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Global Search..." 
                    className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
            </div>
            <div className="ml-auto flex items-center gap-3">
                <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <Badge
                    variant="outline"
                    className="bg-[#C5A880]/10 border-[#C5A880]/40 text-[#0B1B3D] dark:text-[#C5A880]"
                >
                    {roleLabel}
                </Badge>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 ring-2 ring-[#C5A880]/20">
                        <AvatarFallback className="bg-[#0B1B3D] text-white text-xs">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden md:inline font-medium text-[#0B1B3D] dark:text-gray-200">{userEmail}</span>
                </div>
            </div>
        </div>
    )
}

interface DashboardBrandProps {
    icon: React.ComponentType<{ className?: string }>
    title: string
    subtitle: string
}

export function DashboardBrand({ icon: Icon, title, subtitle }: DashboardBrandProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-[#001333] to-[#001333]/80 text-white -m-2 mb-0 rounded-t-md">
            <div className="rounded-lg bg-[#ffab00]/20 p-2">
                <Icon className="h-5 w-5 text-[#ffab00]" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold leading-tight">{title}</span>
                <span className="text-[10px] text-white/60 leading-tight">{subtitle}</span>
            </div>
        </div>
    )
}
