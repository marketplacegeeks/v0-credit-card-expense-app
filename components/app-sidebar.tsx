"use client"

import { CreditCard, LayoutDashboard, ListFilter, Upload } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-screen w-[220px] border-r z-30 bg-gradient-to-b from-[#f3f4f6] to-white">
      <div className="flex items-center px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-primary">ExpenseTracker</span>
        </Link>
      </div>
      <div className="border-t border-border" />
      <div className="p-2 space-y-1 mt-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            pathname === "/" || pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/expenses"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            pathname === "/expenses" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          <ListFilter className="h-4 w-4" />
          <span>Expense List</span>
        </Link>
        <Link
          href="/upload"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            pathname === "/upload" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>Statement Upload</span>
        </Link>
      </div>
    </div>
  )
}
