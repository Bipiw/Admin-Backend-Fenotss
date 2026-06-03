"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart3, Users, Settings, LogOut, Shield, FileText, Key, DollarSign, GraduationCap, User, Bell } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardTopbar, DashboardBrand } from "@/components/dashboard/dashboard-topbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userEmail = session?.user?.email || ""
    const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "AD"

    const items = [
        {
            title: "Overview",
            url: "/dashboard/admin",
            icon: BarChart3,
        },
        {
            title: "User Management",
            url: "/dashboard/admin/users",
            icon: Users,
        },
        {
            title: "System Settings",
            url: "/dashboard/admin/settings",
            icon: Settings,
        },
        {
            title: "Audit Logs",
            url: "/dashboard/admin/logs",
            icon: FileText,
        },
        {
            title: "Notifications",
            url: "/dashboard/admin/notifications",
            icon: Bell,
        },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Sidebar className="border-r-0 border-none bg-gradient-to-b from-[#0B1B3D] to-[#C5A880] [&>div]:bg-transparent text-white">
                    <SidebarHeader>
                        <DashboardBrand icon={Shield} title="Fenot Admin" subtitle="Control Center" />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={pathname === item.url}>
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Other Dashboards</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/finance")}>
                                            <Link href="/dashboard/finance">
                                                <DollarSign />
                                                <span>Finance</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/education")}>
                                            <Link href="/dashboard/education">
                                                <GraduationCap />
                                                <span>Education</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/members-affairs")}>
                                            <Link href="/dashboard/members-affairs">
                                                <Users />
                                                <span>Members Affairs</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/member")}>
                                            <Link href="/dashboard/member">
                                                <User />
                                                <span>Member View</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/dashboard/change-password"}>
                                    <Link href="/dashboard/change-password">
                                        <Key className="h-4 w-4" />
                                        <span>Change Password</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => signOut({ callbackUrl: "/login" })}>
                                    <LogOut />
                                    <span>Sign Out</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 overflow-auto bg-[#F8F9FA] dark:bg-muted/30">
                    <DashboardTopbar title="Super Admin Control Center" roleLabel="HR & Finance" />
                    <div className="p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
