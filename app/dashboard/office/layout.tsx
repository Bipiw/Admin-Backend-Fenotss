"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { LayoutDashboard, Search, FileText, LogOut, Key, Building2 } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardTopbar, DashboardBrand } from "@/components/dashboard/dashboard-topbar"

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const items = [
        { title: "Overview", url: "/dashboard/office", icon: LayoutDashboard },
        { title: "Member Search", url: "/dashboard/office/members", icon: Search },
        { title: "Clearance / Offboarding", url: "/dashboard/office/clearance", icon: FileText },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Sidebar>
                    <SidebarHeader>
                        <DashboardBrand icon={Building2} title="Office / Admin" subtitle="Administration Portal" />
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
                    <DashboardTopbar title="Office Administration" roleLabel="OFFICE" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
