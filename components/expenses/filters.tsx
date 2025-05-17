"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CategoryManager } from "@/components/expenses/category-manager"
import { MerchantManager } from "@/components/expenses/merchant-manager"
import type { DateRange } from "react-day-picker"

interface MerchantRule {
  keyword: string
  merchantName: string
}

interface FiltersProps {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  selectedCard: string
  setSelectedCard: (card: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedMerchant: string
  setSelectedMerchant: (merchant: string) => void
  merchantSearch: string
  setMerchantSearch: (search: string) => void
  categories: string[]
  setCategories: (categories: string[]) => void
  merchants: string[]
  setMerchants: (merchants: string[]) => void
  merchantRules: MerchantRule[]
  setMerchantRules: (rules: MerchantRule[]) => void
  cardNames: string[]
  clearFilters: () => void
}

export function ExpenseFilters({
  dateRange,
  setDateRange,
  selectedCard,
  setSelectedCard,
  selectedCategory,
  setSelectedCategory,
  selectedMerchant,
  setSelectedMerchant,
  merchantSearch,
  setMerchantSearch,
  categories,
  setCategories,
  merchants,
  setMerchants,
  merchantRules,
  setMerchantRules,
  cardNames,
  clearFilters,
}: FiltersProps) {
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false)
  const [isManageMerchantsOpen, setIsManageMerchantsOpen] = useState(false)

  // Handle date range presets
  const handleDatePreset = (preset: string) => {
    const today = new Date()
    let from = new Date()
    let to = today

    switch (preset) {
      case "week":
        from.setDate(today.getDate() - 7)
        break
      case "month":
        from.setMonth(today.getMonth() - 1)
        break
      case "quarter":
        from.setMonth(today.getMonth() - 3)
        break
      default:
        from = undefined
        to = undefined
    }

    setDateRange({ from, to })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Refine your expense list</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
                  <div className="flex items-center justify-between border-t p-3">
                    <Button variant="ghost" size="sm" onClick={() => handleDatePreset("week")}>
                      Last Week
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDatePreset("month")}>
                      Last Month
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDatePreset("quarter")}>
                      Last Quarter
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Card Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Card</label>
            <Select value={selectedCard} onValueChange={setSelectedCard}>
              <SelectTrigger>
                <SelectValue placeholder="All Cards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cards</SelectItem>
                {cardNames.map((card) => (
                  <SelectItem key={card} value={card}>
                    {card}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Category</label>
              <Button variant="ghost" size="sm" onClick={() => setIsManageCategoriesOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Merchant Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Merchant</label>
              <Button variant="ghost" size="sm" onClick={() => setIsManageMerchantsOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
              <SelectTrigger>
                <SelectValue placeholder="All Merchants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Merchants</SelectItem>
                {merchants.map((merchant) => (
                  <SelectItem key={merchant} value={merchant}>
                    {merchant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Merchant Search */}
          <div className="space-y-2 lg:col-span-4">
            <label className="text-sm font-medium">Search Description</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in description"
                className="pl-8"
                value={merchantSearch}
                onChange={(e) => setMerchantSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>

      <CategoryManager
        isOpen={isManageCategoriesOpen}
        setIsOpen={setIsManageCategoriesOpen}
        categories={categories}
        setCategories={setCategories}
      />

      <MerchantManager
        isOpen={isManageMerchantsOpen}
        setIsOpen={setIsManageMerchantsOpen}
        merchants={merchants}
        setMerchants={setMerchants}
        merchantRules={merchantRules}
        setMerchantRules={setMerchantRules}
      />
    </Card>
  )
}
