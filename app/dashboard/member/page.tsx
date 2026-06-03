import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CreditCard, Bell, ChevronRight, ShieldCheck, ArrowDownRight, User, GraduationCap, BookOpen, Clock, Activity, Settings } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function MemberDashboard() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const userProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { 
            profile: {
                include: {
                    eligibility: true,
                    academics: true,
                }
            }
        }
    })

    if (!userProfile?.profile) {
        return (
            <div className="p-8 space-y-8 max-w-xl mx-auto mt-10 text-center">
                <Card className="border-[#C5A880]/30 shadow-xl bg-white dark:bg-[#0B1B3D]">
                    <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold tracking-tight text-[#0B1B3D] dark:text-[#C5A880]">Welcome, {userProfile?.email}</h2>
                        <p className="text-destructive mt-2">Profile not found. Please contact administration to register your member profile.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const profile = userProfile.profile

    // Fetch Recent Payments
    const recentPayments = await prisma.financialRecord.findMany({
        where: { memberId: profile.id },
        orderBy: { date: 'desc' },
        take: 4
    })

    // Fetch Recent Attendance
    const recentAttendance = await prisma.attendance.findMany({
        where: { memberId: profile.id },
        orderBy: { date: 'desc' },
        take: 6
    })

    const eligibility = profile.eligibility
    const isEligible = eligibility?.status === "ELIGIBLE"
    const initials = profile.firstName ? profile.firstName.substring(0,2).toUpperCase() : "??"

    // Simple attendance calculation for visual indicators
    const presentCount = recentAttendance.filter(a => a.status === "PRESENT").length
    const totalCount = recentAttendance.length
    const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-[#0B1B3D] dark:text-slate-100">
            {/* Header / Welcome Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1B3D] via-[#152e61] to-[#1a3875] p-6 md:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-4 ring-[#C5A880] ring-offset-4 ring-offset-[#0B1B3D]">
                            <AvatarFallback className="bg-[#C5A880] text-[#0B1B3D] font-black text-xl md:text-2xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Welcome back,</p>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">{profile.firstName} {profile.lastName}</h1>
                            <p className="text-xs text-white/50 mt-1">Department: <span className="font-semibold text-[#C5A880] uppercase">{profile.department || "General"}</span></p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-right">
                            <p className="text-xs text-white/60">Local Date</p>
                            <p className="text-sm font-semibold text-[#C5A880] mt-0.5">
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <button className="relative p-3 bg-white/10 hover:bg-white/20 transition rounded-full">
                            <Bell className="h-5 w-5 text-white" />
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0B1B3D]"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Service Status */}
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-[#0B1B3D]/80 relative group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C5A880]"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service Status</p>
                                <h3 className={`text-xl font-bold mt-2 ${isEligible ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {isEligible ? 'Eligible (ብቁ)' : 'Pending'}
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-1">Status of system clearance</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${isEligible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Last Payment */}
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-[#0B1B3D]/80 relative group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0B1B3D]"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Latest Payment</p>
                                <h3 className="text-xl font-extrabold mt-2 text-[#0B1B3D] dark:text-slate-100">
                                    {recentPayments[0] ? `${recentPayments[0].amount} ETB` : "0 ETB"}
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    {recentPayments[0] ? `Paid on ${new Date(recentPayments[0].date).toLocaleDateString()}` : "No payments found"}
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#0B1B3D]/5 dark:bg-white/5 text-[#0B1B3D] dark:text-[#C5A880]">
                                <CreditCard className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Attendance Rate */}
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-[#0B1B3D]/80 relative group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance Rate</p>
                                <h3 className="text-xl font-extrabold mt-2 text-[#0B1B3D] dark:text-slate-100">
                                    {attendanceRate}%
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-1">Based on recent {totalCount} records</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                <Calendar className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Active Record Stats */}
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-[#0B1B3D]/80 relative group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engagement</p>
                                <h3 className="text-xl font-bold mt-2 text-emerald-500">
                                    Active
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-1">Profile stands operational</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                <Activity className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Columns - col-span-2: Quick Actions & Attendance Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <Card className="border border-slate-100 dark:border-slate-800 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link href="/dashboard/member/finance" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-[#C5A880]/30 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-1">
                                    <div className="h-14 w-14 rounded-2xl bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] group-hover:scale-110 transition-transform">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold mt-3 text-[#0B1B3D] dark:text-slate-200">Pay Dues</span>
                                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Manage payments</span>
                                </Link>
                                <Link href="/dashboard/member/attendance" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-400/30 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-1">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold mt-3 text-[#0B1B3D] dark:text-slate-200">Attendance</span>
                                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Verify check-ins</span>
                                </Link>
                                <Link href="/dashboard/member/grades" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-400/30 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-1">
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold mt-3 text-[#0B1B3D] dark:text-slate-200">My Grades</span>
                                    <span className="text-[10px] text-muted-foreground mt-1 text-center">View exam results</span>
                                </Link>
                                <Link href="/dashboard/member/profile" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-400/30 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-1">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold mt-3 text-[#0B1B3D] dark:text-slate-200">Profile Details</span>
                                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Manage account</span>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Grid Summary */}
                    <Card className="border border-slate-100 dark:border-slate-800 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Recent Attendance</CardTitle>
                                <p className="text-xs text-muted-foreground">View your recent check-in track record</p>
                            </div>
                            <Link href="/dashboard/member/attendance" className="text-xs font-semibold text-[#C5A880] hover:underline flex items-center gap-1">
                                See Full Log <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {recentAttendance.length > 0 ? recentAttendance.map((record) => {
                                    const d = new Date(record.date)
                                    const isPresent = record.status === "PRESENT"
                                    return (
                                        <div key={record.id} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                                            isPresent 
                                                ? 'bg-[#0B1B3D] border-[#0B1B3D] text-white shadow-sm' 
                                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-[#0B1B3D] dark:text-slate-200'
                                        }`}>
                                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">{d.toLocaleString('default', { weekday: 'short' })}</span>
                                            <span className="text-2xl font-black">{d.getDate()}</span>
                                            <span className="text-[9px] font-semibold">{d.toLocaleString('default', { month: 'short' })}</span>
                                            <Badge className={`text-[9px] font-bold mt-1 shadow-none ${
                                                isPresent 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-destructive/15 text-destructive border-none'
                                            }`}>
                                                {isPresent ? 'Present' : 'Absent'}
                                            </Badge>
                                        </div>
                                    )
                                }) : (
                                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                                        No recent attendance records found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Financial Standing & Service Status Details */}
                <div className="space-y-6">
                    {/* Recent Payments History */}
                    <Card className="border border-slate-100 dark:border-slate-800 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Payments History</CardTitle>
                            </div>
                            <Link href="/dashboard/member/finance" className="text-xs font-semibold text-[#C5A880] hover:underline">
                                View All
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentPayments.length > 0 ? recentPayments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <ArrowDownRight className="h-5 w-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[#0B1B3D] dark:text-slate-200">
                                                {payment.type === "MONTHLY_CONTRIBUTION" ? "Monthly Contribution" : payment.type.replace('_', ' ')}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(payment.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-sm text-[#0B1B3D] dark:text-slate-200">{payment.amount.toLocaleString()} ETB</p>
                                        <Badge className="text-[9px] font-bold mt-1 bg-emerald-500 hover:bg-emerald-500 text-white border-none shadow-none">Paid</Badge>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    No recent transactions found.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resources & Support Helper */}
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-[#0B1B3D] to-[#122754] text-white">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A880]">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Need Resources or Help?</h4>
                                    <p className="text-xs text-white/60">Access files, forms & guides</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Get access to various study materials, choir hymnals, rules and regulations, and educational contents published by the admins.
                            </p>
                            <Link href="/dashboard/member/resources" className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b59871] text-[#0B1B3D] text-xs font-bold transition">
                                Open Portal Library
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
