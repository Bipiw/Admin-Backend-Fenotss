"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { LayoutDashboard, Calendar, CreditCard, UserCircle, LogOut, Book, Key, GraduationCap, ShieldCheck } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardTopbar, DashboardBrand } from "@/components/dashboard/dashboard-topbar"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const items = [
        {
            title: "My Dashboard",
            url: "/dashboard/member",
            icon: LayoutDashboard,
        },
        {
            title: "My Attendance",
            url: "/dashboard/member/attendance",
            icon: Calendar,
        },
        {
            title: "My Grades",
            url: "/dashboard/member/grades",
            icon: GraduationCap,
        },
        {
            title: "My Payments",
            url: "/dashboard/member/finance",
            icon: CreditCard,
        },
        {
            title: "Service Status",
            url: "/dashboard/member/service-status",
            icon: ShieldCheck,
        },
        {
            title: "Resources",
            url: "/dashboard/member/resources",
            icon: Book,
        },
        {
            title: "My Profile",
            url: "/dashboard/member/profile",
            icon: UserCircle,
        },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Sidebar>
                    <SidebarHeader>
                        <DashboardBrand icon={UserCircle} title="Member Portal" subtitle="My Account" />
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
                <main className="flex-1 overflow-auto bg-muted/30">
                    <DashboardTopbar title="My Account" roleLabel="MEMBER" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
