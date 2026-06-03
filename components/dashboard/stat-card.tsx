import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        label?: string
    }
    accent?: "navy" | "gold" | "green" | "red" | "teal" | "indigo"
}

const accentStyles: Record<
    NonNullable<StatCardProps["accent"]>,
    { bg: string; iconBg: string }
> = {
    navy: {
        bg: "bg-gradient-to-br from-[#0B1B3D] to-[#162d5a]",
        iconBg: "bg-white/15",
    },
    gold: {
        bg: "bg-gradient-to-br from-[#C5A880] to-[#d4bc9a]",
        iconBg: "bg-white/20",
    },
    green: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        iconBg: "bg-white/20",
    },
    red: {
        bg: "bg-gradient-to-br from-rose-500 to-rose-600",
        iconBg: "bg-white/20",
    },
    teal: {
        bg: "bg-gradient-to-br from-teal-500 to-teal-600",
        iconBg: "bg-white/20",
    },
    indigo: {
        bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        iconBg: "bg-white/20",
    },
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    accent = "navy",
}: StatCardProps) {
    const styles = accentStyles[accent]
    const trendPositive = (trend?.value ?? 0) >= 0

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-default",
                styles.bg
            )}
        >
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                        {title}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {description && (
                        <p className="text-xs text-white/60">{description}</p>
                    )}
                </div>
                <div className={cn("rounded-xl p-3 shrink-0", styles.iconBg)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>

            {trend && (
                <div className="relative mt-3 flex items-center gap-1.5 text-xs">
                    <div
                        className={cn(
                            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold",
                            trendPositive
                                ? "bg-white/20 text-white"
                                : "bg-red-400/30 text-white"
                        )}
                    >
                        {trendPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {trendPositive ? "+" : ""}
                        {trend.value}%
                    </div>
                    {trend.label && (
                        <span className="text-white/50">{trend.label}</span>
                    )}
                </div>
            )}
        </div>
    )
}
