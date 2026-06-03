"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid, Legend } from "recharts"

interface FinanceChartsProps {
    data: {
        name: string
        income: number
        expenses: number
    }[]
}

export function RevenueTrendChart({ data }: FinanceChartsProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Income"
                />
                <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Expenses"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

interface PaymentStatusProps {
    data: {
        status: string
        count: number
        color: string
    }[]
}

export function PaymentStatusDistribution({ data }: PaymentStatusProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="status"
                    type="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
