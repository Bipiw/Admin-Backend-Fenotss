"use client"

import { LayoutDashboard, GraduationCap, Library, BookOpen, UserPlus, FolderOpen } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function EducationLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.overview"), url: "/dashboard/education", icon: LayoutDashboard },
        { title: t("sidebar.education.enrollment"), url: "/dashboard/education/enrollment", icon: UserPlus },
        { title: t("sidebar.education.records"), url: "/dashboard/education/records", icon: FolderOpen },
        { title: t("sidebar.education.grades"), url: "/dashboard/education/grades", icon: GraduationCap },
        { title: t("sidebar.education.resources"), url: "/dashboard/education/resources", icon: Library },
        { title: t("sidebar.education.curriculum"), url: "/dashboard/education/levels", icon: BookOpen },
    ]

    return (
        <DashboardShell
            navItems={navItems}
            brandTitle={t("role.education")}
            brandSubtitle="Academic Portal"
            brandIcon={GraduationCap}
            roleLabel={t("role.education").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
