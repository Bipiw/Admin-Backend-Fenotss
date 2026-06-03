"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Users, ClipboardCheck, UserPlus, LogOut, LayoutDashboard, Key, ShieldCheck } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardTopbar, DashboardBrand } from "@/components/dashboard/dashboard-topbar"

export default function MembersAffairsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const items = [
        {
            title: "Overview",
            url: "/dashboard/members-affairs",
            icon: LayoutDashboard,
        },
        {
            title: "Member Directory",
            url: "/dashboard/members-affairs/members",
            icon: Users,
        },
        {
            title: "Attendance Logging",
            url: "/dashboard/members-affairs/attendance",
            icon: ClipboardCheck,
        },
        {
            title: "Assignments",
            url: "/dashboard/members-affairs/assignments",
            icon: UserPlus,
        },
        {
            title: "Eligibility Engine",
            url: "/dashboard/members-affairs/eligibility",
            icon: ShieldCheck,
        },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Sidebar>
                    <SidebarHeader>
                        <DashboardBrand icon={Users} title="Members Affairs" subtitle="Engagement Portal" />
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
                    <DashboardTopbar title="Members Affairs Portal" roleLabel="MEMBERS AFFAIRS" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
