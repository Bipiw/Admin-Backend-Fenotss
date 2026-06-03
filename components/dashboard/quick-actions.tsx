import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, UserPlus, DollarSign, CalendarCheck, Megaphone, GraduationCap, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const actions = [
    {
        label: "Add User",
        href: "/dashboard/admin/users",
        icon: UserPlus,
        color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    {
        label: "Record Payment",
        href: "/dashboard/finance/payments",
        icon: DollarSign,
        color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
    },
    {
        label: "Log Attendance",
        href: "/dashboard/members-affairs/attendance",
        icon: CalendarCheck,
        color: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/20",
    },
    {
        label: "Enrollment",
        href: "/dashboard/education/enrollment",
        icon: GraduationCap,
        color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    },
    {
        label: "Announcements",
        href: "/dashboard/admin",
        icon: Megaphone,
        color: "bg-[#ffab00]/15 text-[#ffab00] hover:bg-[#ffab00]/25",
    },
    {
        label: "Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
        color: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20",
    },
]

export function QuickActions() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Zap className="h-4 w-4 text-[#ffab00]" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2">
                    {actions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1.5 rounded-lg p-3 transition-colors text-center",
                                    action.color
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-[11px] font-medium leading-tight">
                                    {action.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
