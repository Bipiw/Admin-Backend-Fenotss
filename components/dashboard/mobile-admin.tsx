import { StatCard } from "@/components/dashboard/stat-card";
import { Overview } from "@/components/dashboard/overview";
import { Card, Avatar, AvatarFallback } from "@/components/ui";
import { Users, DollarSign, CalendarCheck, Megaphone } from "lucide-react";
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display";
import { useSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export const MobileAdminDashboard = async () => {
  const { data: session } = await getServerSession(authOptions);
  // Fetch data – reuse same queries as desktop version
  const totalMembers = await prisma.user.count({ where: { role: "MEMBER" } });
  const totalUsers = await prisma.user.count();
  const activeAnnouncements = await prisma.announcement.count({ where: { isActive: true } });
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentRev = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: { type: "MONTHLY_CONTRIBUTION", status: "PAID", date: { gte: startOfMonth } },
  });
  const monthlyRevenue = currentRev._sum.amount ? Number(currentRev._sum.amount) : 0;
  const revenueTrend = 0; // simplified for mobile
  const attendance = await prisma.attendance.groupBy({ by: ["memberId"], where: { status: "PRESENT" } });
  const activeMembers = attendance.length;

  const userEmail = session?.user?.email || "";
  const userName = userEmail.split("@")[0];

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
              {userName.substring(0, 2).toUpperCase()}
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
