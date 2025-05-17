"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MerchantsChartProps {
  data: Array<{ name: string; amount: number }>
  timeFrame: string
  onTimeFrameChange: (value: string) => void
}

export function MerchantsChart({ data, timeFrame, onTimeFrameChange }: MerchantsChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Merchants</CardTitle>
          <CardDescription>Your highest spending merchants</CardDescription>
        </div>
        <Select value={timeFrame} onValueChange={onTimeFrameChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
              <XAxis type="number" tickFormatter={(value) => `$${value}`} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
              <Bar dataKey="amount" fill="hsl(var(--amber))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
