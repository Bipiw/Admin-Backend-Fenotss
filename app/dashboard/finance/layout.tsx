"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { LayoutDashboard, Wallet, CreditCard, AlertCircle, LogOut, Key, TableProperties } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardTopbar, DashboardBrand } from "@/components/dashboard/dashboard-topbar"

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const items = [
        {
            title: "Overview",
            url: "/dashboard/finance",
            icon: LayoutDashboard,
        },
        {
            title: "Monthly Ledger",
            url: "/dashboard/finance/ledger",
            icon: TableProperties,
        },
        {
            title: "Record Payment",
            url: "/dashboard/finance/payments",
            icon: CreditCard,
        },
        {
            title: "Transactions",
            url: "/dashboard/finance/transactions",
            icon: Wallet,
        },
        {
            title: "Defaulters",
            url: "/dashboard/finance/defaulters",
            icon: AlertCircle,
        },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Sidebar>
                    <SidebarHeader>
                        <DashboardBrand icon={Wallet} title="Finance Dept" subtitle="Accounting Portal" />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={pathname.startsWith(item.url) && item.url !== '/dashboard/finance' ? true : pathname === item.url}>
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
                    <DashboardTopbar title="Finance & Accounting" roleLabel="FINANCE" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
