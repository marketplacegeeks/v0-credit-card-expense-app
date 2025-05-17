"use client"

import { useState } from "react"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { MonthlyChart } from "@/components/dashboard/monthly-chart"
import { MerchantsChart } from "@/components/dashboard/merchants-chart"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { CardSummary } from "@/components/dashboard/card-summary"

// Sample data
const expensesByCategory = [
  { name: "Groceries", amount: 450 },
  { name: "Dining", amount: 300 },
  { name: "Shopping", amount: 250 },
  { name: "Travel", amount: 500 },
  { name: "Utilities", amount: 200 },
  { name: "Other", amount: 150 },
]

const topMerchants = [
  { name: "Amazon", amount: 320 },
  { name: "Walmart", amount: 280 },
  { name: "Target", amount: 220 },
  { name: "Uber", amount: 180 },
  { name: "Starbucks", amount: 120 },
]

const topTransactions = [
  { date: "2025-05-12", merchant: "Amazon", amount: 129.99, category: "Shopping" },
  { date: "2025-05-10", merchant: "Walmart", amount: 95.47, category: "Groceries" },
  { date: "2025-05-08", merchant: "Delta Airlines", amount: 450.0, category: "Travel" },
  { date: "2025-05-07", merchant: "Target", amount: 87.32, category: "Shopping" },
  { date: "2025-05-05", merchant: "Uber", amount: 42.75, category: "Travel" },
  { date: "2025-05-03", merchant: "Starbucks", amount: 18.45, category: "Dining" },
  { date: "2025-05-02", merchant: "Netflix", amount: 15.99, category: "Entertainment" },
  { date: "2025-05-01", merchant: "Chevron", amount: 45.82, category: "Gas" },
  { date: "2025-04-30", merchant: "Whole Foods", amount: 112.34, category: "Groceries" },
  { date: "2025-04-28", merchant: "Apple", amount: 199.99, category: "Electronics" },
]

const monthlyExpenses = [
  {
    name: "Jan",
    Chase: 1200,
    Amex: 650,
    Discover: 750,
    Total: 2600,
  },
  {
    name: "Feb",
    Chase: 1300,
    Amex: 700,
    Discover: 650,
    Total: 2650,
  },
  {
    name: "Mar",
    Chase: 1150,
    Amex: 800,
    Discover: 700,
    Total: 2650,
  },
  {
    name: "Apr",
    Chase: 1350,
    Amex: 750,
    Discover: 650,
    Total: 2750,
  },
  {
    name: "May",
    Chase: 1500,
    Amex: 800,
    Discover: 750,
    Total: 3050,
  },
  {
    name: "Jun",
    Chase: 1250,
    Amex: 850,
    Discover: 700,
    Total: 2800,
  },
]

const cardData = [
  {
    name: "Chase Sapphire",
    nextPayment: "$450.75",
    dueDate: "2025-05-20",
  },
  {
    name: "American Express Gold",
    nextPayment: "$320.50",
    dueDate: "2025-05-15",
  },
  {
    name: "Discover It",
    nextPayment: "$275.25",
    dueDate: "2025-05-22",
  },
]

export default function DashboardPage() {
  const [timeFrame, setTimeFrame] = useState("month")

  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your credit card expenses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart data={expensesByCategory} timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />

        <MonthlyChart data={monthlyExpenses} />

        <MerchantsChart data={topMerchants} timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />

        <TransactionsTable data={topTransactions} timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />

        <CardSummary data={cardData} />
      </div>
    </div>
  )
}
