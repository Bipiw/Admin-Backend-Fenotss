import { StatCard } from "@/components/dashboard/stat-card";
import { Overview } from "@/components/dashboard/overview";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign, CalendarCheck, Megaphone } from "lucide-react";
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display";

export interface MobileAdminDashboardProps {
  userName: string;
  totalMembers: number;
  totalUsers: number;
  monthlyRevenue: number;
  activeMembers: number;
  activeAnnouncements: number;
  revenueTrend?: number;
}

export const MobileAdminDashboard = ({
  userName,
  totalMembers,
  totalUsers,
  monthlyRevenue,
  activeMembers,
  activeAnnouncements,
  revenueTrend = 0,
}: MobileAdminDashboardProps) => {
  const initials = userName ? userName.substring(0, 2).toUpperCase() : "AD";

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {userName}</p>
        <EthiopianDateDisplay />
      </div>
      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-1">
        <StatCard title="Total Members" value={totalMembers} description={`${totalUsers} users`} icon={Users} accent="navy" />
        <StatCard title="Monthly Revenue" value={`${monthlyRevenue.toLocaleString()} ETB`} description="Contributions" icon={DollarSign} accent="green" trend={{ value: revenueTrend, label: "vs last month" }} />
        <StatCard title="Active Members" value={activeMembers} description="30d engagement" icon={CalendarCheck} accent="teal" />
        <StatCard title="Announcements" value={activeAnnouncements} description="Visible" icon={Megaphone} accent="gold" />
      </div>
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-[#0B1B3D] to-[#1a3060] p-4 text-center">
          <Avatar className="h-16 w-16 mx-auto ring-2 ring-[#C5A880] ring-offset-2 ring-offset-[#0B1B3D]">
            <AvatarFallback className="bg-[#C5A880] text-[#0B1B3D] text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-white font-medium">{userName}</p>
          <p className="text-sm text-[#C5A880]">HR & Finance</p>
        </div>
      </Card>
      {/* Overview Chart – simplified */}
      <Overview data={[]} />
    </div>
  );
};
