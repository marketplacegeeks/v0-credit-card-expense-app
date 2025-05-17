"use client"

import { useState, useEffect } from "react"
import { ExpenseFilters } from "@/components/expenses/filters"
import { ExpenseTable } from "@/components/expenses/expense-table"
import { toast } from "@/components/ui/use-toast"
import type { DateRange } from "react-day-picker"

// Define types
interface Expense {
  id: string
  date: string
  cardName: string
  category: string
  merchant: string
  description: string
  amount: number
}

interface MerchantRule {
  keyword: string
  merchantName: string
}

// Sample expense data
const expensesData: Expense[] = [
  {
    id: "1",
    date: "2025-05-15",
    cardName: "Chase Sapphire",
    category: "Restaurant",
    merchant: "Cheesecake Factory",
    description: "Dinner with clients",
    amount: 125.75,
  },
  {
    id: "2",
    date: "2025-05-14",
    cardName: "American Express Gold",
    category: "Travel",
    merchant: "Delta Airlines",
    description: "Flight to New York",
    amount: 450.0,
  },
  {
    id: "3",
    date: "2025-05-13",
    cardName: "Discover It",
    category: "Phone & Internet",
    merchant: "Verizon",
    description: "Monthly phone bill",
    amount: 95.99,
  },
  {
    id: "4",
    date: "2025-05-12",
    cardName: "Chase Sapphire",
    category: "Taxi",
    merchant: "Uber",
    description: "Ride to airport",
    amount: 35.5,
  },
  {
    id: "5",
    date: "2025-05-10",
    cardName: "American Express Gold",
    category: "Restaurant",
    merchant: "Starbucks",
    description: "Coffee meeting",
    amount: 18.25,
  },
  {
    id: "6",
    date: "2025-05-08",
    cardName: "Discover It",
    category: "Travel",
    merchant: "Hilton Hotels",
    description: "Hotel stay in Chicago",
    amount: 320.45,
  },
  {
    id: "7",
    date: "2025-05-07",
    cardName: "Chase Sapphire",
    category: "Phone & Internet",
    merchant: "AT&T",
    description: "Internet service",
    amount: 79.99,
  },
  {
    id: "8",
    date: "2025-05-05",
    cardName: "American Express Gold",
    category: "Taxi",
    merchant: "Lyft",
    description: "Ride to meeting",
    amount: 22.75,
  },
  {
    id: "9",
    date: "2025-05-03",
    cardName: "Discover It",
    category: "Restaurant",
    merchant: "Chipotle",
    description: "Lunch",
    amount: 15.45,
  },
  {
    id: "10",
    date: "2025-05-01",
    cardName: "Chase Sapphire",
    category: "Travel",
    merchant: "Airbnb",
    description: "Accommodation in Miami",
    amount: 275.0,
  },
  {
    id: "11",
    date: "2025-04-28",
    cardName: "American Express Gold",
    category: "Phone & Internet",
    merchant: "T-Mobile",
    description: "Family plan",
    amount: 120.5,
  },
  {
    id: "12",
    date: "2025-04-25",
    cardName: "Discover It",
    category: "Taxi",
    merchant: "Uber",
    description: "Ride home",
    amount: 18.99,
  },
]

const initialCategories = ["Restaurant", "Taxi", "Travel", "Phone & Internet"]
const initialMerchants = [
  "Cheesecake Factory",
  "Delta Airlines",
  "Verizon",
  "Uber",
  "Starbucks",
  "Hilton Hotels",
  "AT&T",
  "Lyft",
  "Chipotle",
  "Airbnb",
  "T-Mobile",
]
const initialMerchantRules = [
  { keyword: "coffee", merchantName: "Starbucks" },
  { keyword: "uber", merchantName: "Uber" },
  { keyword: "flight", merchantName: "Delta Airlines" },
]
const cardNames = ["Chase Sapphire", "American Express Gold", "Discover It"]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(expensesData)
  const [allExpenses, setAllExpenses] = useState<Expense[]>(expensesData)
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined })
  const [selectedCard, setSelectedCard] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedMerchant, setSelectedMerchant] = useState<string>("")
  const [merchantSearch, setMerchantSearch] = useState<string>("")
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [merchants, setMerchants] = useState<string[]>(initialMerchants)
  const [merchantRules, setMerchantRules] = useState<MerchantRule[]>(initialMerchantRules)

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    let filteredData = [...allExpenses]

    // Apply date filter
    if (dateRange?.from) {
      filteredData = filteredData.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= dateRange.from!
      })
    }

    if (dateRange?.to) {
      filteredData = filteredData.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate <= dateRange.to!
      })
    }

    // Apply card filter
    if (selectedCard && selectedCard !== "all") {
      filteredData = filteredData.filter((expense) => expense.cardName === selectedCard)
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filteredData = filteredData.filter((expense) => expense.category === selectedCategory)
    }

    // Apply merchant filter
    if (selectedMerchant && selectedMerchant !== "all") {
      filteredData = filteredData.filter((expense) => expense.merchant === selectedMerchant)
    }

    // Apply description search
    if (merchantSearch) {
      filteredData = filteredData.filter((expense) =>
        expense.description.toLowerCase().includes(merchantSearch.toLowerCase()),
      )
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let comparison = 0

      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category)
      } else if (sortField === "merchant") {
        comparison = a.merchant.localeCompare(b.merchant)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setExpenses(filteredData)
  }, [
    sortField,
    sortDirection,
    dateRange,
    selectedCard,
    selectedCategory,
    selectedMerchant,
    merchantSearch,
    allExpenses,
  ])

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setSelectedCard("")
    setSelectedCategory("")
    setSelectedMerchant("")
    setMerchantSearch("")
  }

  // Handle category change in table
  const handleCategoryChange = (expenseId: string, newCategory: string) => {
    const updatedExpenses = allExpenses.map((expense) => {
      if (expense.id === expenseId) {
        return { ...expense, category: newCategory }
      }
      return expense
    })

    setAllExpenses(updatedExpenses)

    toast({
      title: "Category updated",
      description: "Expense category has been updated successfully.",
    })
  }

  // Handle merchant change
  const handleMerchantChange = (expenseId: string, newMerchant: string) => {
    const updatedExpenses = allExpenses.map((expense) => {
      if (expense.id === expenseId) {
        return { ...expense, merchant: newMerchant }
      }
      return expense
    })

    setAllExpenses(updatedExpenses)

    toast({
      title: "Merchant updated",
      description: "Merchant name has been updated successfully.",
    })
  }

  // Apply merchant rules to a new expense based on description
  const applyMerchantRules = (description: string): string | null => {
    for (const rule of merchantRules) {
      if (description.toLowerCase().includes(rule.keyword.toLowerCase())) {
        return rule.merchantName
      }
    }
    return null
  }

  // This function would be used when adding new expenses
  const addNewExpense = (expense: Omit<Expense, "id" | "merchant">) => {
    // Generate a unique ID
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Apply merchant rules based on description
    let merchant = ""
    const rulesResult = applyMerchantRules(expense.description)
    if (rulesResult) {
      merchant = rulesResult
    } else {
      // Default to first word of description or "Unknown"
      const firstWord = expense.description.split(" ")[0]
      merchant = firstWord || "Unknown"
    }

    const newExpense: Expense = {
      ...expense,
      id,
      merchant,
    }

    setAllExpenses((prev) => [...prev, newExpense])

    toast({
      title: "Expense added",
      description: "New expense has been added successfully.",
    })
  }

  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Expense List</h1>
        <p className="text-muted-foreground">View and filter your expenses</p>
      </div>

      <ExpenseFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedMerchant={selectedMerchant}
        setSelectedMerchant={setSelectedMerchant}
        merchantSearch={merchantSearch}
        setMerchantSearch={setMerchantSearch}
        categories={categories}
        setCategories={setCategories}
        merchants={merchants}
        setMerchants={setMerchants}
        merchantRules={merchantRules}
        setMerchantRules={setMerchantRules}
        cardNames={cardNames}
        clearFilters={clearFilters}
      />

      <ExpenseTable
        expenses={expenses}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        categories={categories}
        merchants={merchants}
        onCategoryChange={handleCategoryChange}
        onMerchantChange={handleMerchantChange}
      />
    </div>
  )
}
