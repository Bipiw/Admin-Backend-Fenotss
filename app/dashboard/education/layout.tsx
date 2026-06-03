"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { LayoutDashboard, GraduationCap, BookOpen, Library, LogOut, UserPlus, Key, ClipboardCheck } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardTopbar, DashboardBrand } from "@/components/dashboard/dashboard-topbar"

export default function EducationLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const items = [
        {
            title: "Overview",
            url: "/dashboard/education",
            icon: LayoutDashboard,
        },
        {
            title: "Enrollment / Promotion",
            url: "/dashboard/education/enrollment",
            icon: UserPlus,
        },
        {
            title: "Student Records",
            url: "/dashboard/education/records",
            icon: Library,
        },
        {
            title: "Grade Management",
            url: "/dashboard/education/grades",
            icon: GraduationCap,
        },
        {
            title: "Curriculum / Levels",
            url: "/dashboard/education/levels",
            icon: BookOpen,
        },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Sidebar>
                    <SidebarHeader>
                        <DashboardBrand icon={GraduationCap} title="Education Dept" subtitle="Academic Portal" />
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
                    <DashboardTopbar title="Academic Administration" roleLabel="EDUCATION" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
