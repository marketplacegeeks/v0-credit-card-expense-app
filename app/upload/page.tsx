"use client"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddCardDialog } from "@/components/upload/add-card-dialog"
import { UploadDialog } from "@/components/upload/upload-dialog"
import { StatementsTable } from "@/components/upload/statements-table"
import { CardsTable } from "@/components/upload/cards-table"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

// Sample data
const statementsData = [
  {
    id: "1",
    bank: "Chase",
    amountDue: "$450.75",
    statementDate: "2025-04-15",
    dueDate: "2025-05-20",
    financeCharge: "$0.00",
    otherCharges: "$0.00",
  },
  {
    id: "2",
    bank: "American Express",
    amountDue: "$320.50",
    statementDate: "2025-04-10",
    dueDate: "2025-05-15",
    financeCharge: "$0.00",
    otherCharges: "$12.99",
  },
  {
    id: "3",
    bank: "Discover",
    amountDue: "$275.25",
    statementDate: "2025-04-17",
    dueDate: "2025-05-22",
    financeCharge: "$0.00",
    otherCharges: "$0.00",
  },
]

const savedCards = [
  {
    id: "1",
    name: "Chase Sapphire Preferred",
    bank: "Chase",
    lastFour: "4567",
    hasPassword: true,
    addedDate: "2025-01-15",
  },
  {
    id: "2",
    name: "American Express Gold",
    bank: "American Express",
    lastFour: "8901",
    hasPassword: true,
    addedDate: "2025-02-03",
  },
  {
    id: "3",
    name: "Discover It Cash Back",
    bank: "Discover",
    lastFour: "2345",
    hasPassword: false,
    addedDate: "2025-03-21",
  },
]

const banks = [
  { value: "chase", label: "Chase" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "citi", label: "Citibank" },
  { value: "bofa", label: "Bank of America" },
  { value: "capital-one", label: "Capital One" },
]

interface FormValues {
  cardName: string
  bank: string
  lastFour: string
  password: string
}

interface UploadFormValues {
  card: string
  file: File | null
}

export default function UploadPage() {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("statements")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [statements, setStatements] = useState(statementsData)

  const onAddCardSubmit = (data: FormValues) => {
    console.log("Add card data:", data)
    setIsAddCardOpen(false)

    toast({
      title: "Card added",
      description: `${data.cardName} has been added to your account.`,
    })
  }

  const onUploadSubmit = (data: UploadFormValues, range: DateRange | undefined) => {
    console.log("Upload data:", data)
    if (range) {
      console.log(
        "Statement period:",
        `${format(range.from!, "MMMM yyyy")}`,
        range.from ? format(range.from, "yyyy-MM-dd") : "N/A",
        "to",
        range.to ? format(range.to, "yyyy-MM-dd") : "N/A",
      )
    }
    setIsUploadOpen(false)

    toast({
      title: "Statement uploaded",
      description: "Your statement has been successfully uploaded.",
    })
  }

  const handleDeleteStatements = (ids: string[]) => {
    console.log("Deleting statements with IDs:", ids)
    // In a real app, you would call an API to delete these statements
    setStatements((prev) => prev.filter((statement) => !ids.includes(statement.id)))
  }

  return (
    <div className="max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Statement Upload</h1>
          <p className="text-muted-foreground">Manage your credit cards and statements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddCardOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Statement
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="cards">Saved Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="statements">
          <StatementsTable statements={statements} onDeleteStatements={handleDeleteStatements} />
        </TabsContent>

        <TabsContent value="cards">
          <CardsTable cards={savedCards} />
        </TabsContent>
      </Tabs>

      <AddCardDialog isOpen={isAddCardOpen} setIsOpen={setIsAddCardOpen} banks={banks} onSubmit={onAddCardSubmit} />

      <UploadDialog
        isOpen={isUploadOpen}
        setIsOpen={setIsUploadOpen}
        cards={savedCards}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSubmit={onUploadSubmit}
      />
    </div>
  )
}
