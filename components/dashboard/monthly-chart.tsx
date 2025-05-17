"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MonthlyData {
  name: string
  Chase: number
  Amex: number
  Discover: number
  Total: number
}

interface MonthlyChartProps {
  data: MonthlyData[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Track your expenses over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value}`, ""]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Chase"
                stroke="hsl(var(--amber))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--amber))" }}
              />
              <Line
                type="monotone"
                dataKey="Discover"
                stroke="hsl(var(--teal))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--teal))" }}
              />
              <Line type="monotone" dataKey="Amex" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4, fill: "#94a3b8" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
