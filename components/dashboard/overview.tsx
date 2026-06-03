"use client"

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts"

interface OverviewProps {
    data: {
        name: string
        total: number
        revenue?: number
        newMembers?: number
    }[]
}

export function Overview({ data }: OverviewProps) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1B3D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0B1B3D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A880" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C5A880" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#0B1B3D",
                        border: "none",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#C5A880", fontWeight: 600, marginBottom: 4 }}
                />
                <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    name="Attendance"
                    stroke="#0B1B3D"
                    strokeWidth={2.5}
                    fill="url(#colorAttendance)"
                    dot={{ r: 4, fill: "#0B1B3D", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, fill: "#0B1B3D", stroke: "#fff", strokeWidth: 2 }}
                />
                {data.some((d) => d.revenue !== undefined) && (
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#C5A880"
                        strokeWidth={2.5}
                        fill="url(#colorRevenue)"
                        dot={{ r: 4, fill: "#C5A880", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#C5A880", stroke: "#fff", strokeWidth: 2 }}
                    />
                )}
                {data.some((d) => d.newMembers !== undefined) && (
                    <Area
                        type="monotone"
                        dataKey="newMembers"
                        name="New Members"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#colorMembers)"
                        dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                    />
                )}
            </AreaChart>
        </ResponsiveContainer>
    )
}
