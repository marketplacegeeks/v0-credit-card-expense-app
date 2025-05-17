"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Expense {
  id: string
  date: string
  cardName: string
  category: string
  merchant: string
  description: string
  amount: number
}

interface ExpenseTableProps {
  expenses: Expense[]
  sortField: string
  sortDirection: "asc" | "desc"
  handleSort: (field: string) => void
  categories: string[]
  merchants: string[]
  onCategoryChange: (expenseId: string, newCategory: string) => void
  onMerchantChange: (expenseId: string, newMerchant: string) => void
}

export function ExpenseTable({
  expenses,
  sortField,
  sortDirection,
  handleSort,
  categories,
  merchants,
  onCategoryChange,
  onMerchantChange,
}: ExpenseTableProps) {
  const [editingCellId, setEditingCellId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = useState(false)
  const [bulkEditField, setBulkEditField] = useState<"category" | "merchant" | null>(null)
  const [bulkEditValue, setBulkEditValue] = useState<string>("")

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExpenses(expenses.map((expense) => expense.id))
    } else {
      setSelectedExpenses([])
    }
  }

  const handleSelectExpense = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedExpenses((prev) => [...prev, id])
    } else {
      setSelectedExpenses((prev) => prev.filter((expenseId) => expenseId !== id))
    }
  }

  const openBulkEditDialog = (field: "category" | "merchant") => {
    setBulkEditField(field)
    setBulkEditValue("")
    setIsBulkEditDialogOpen(true)
  }

  const handleBulkEdit = () => {
    if (!bulkEditField || !bulkEditValue) return

    // Apply the change to all selected expenses
    selectedExpenses.forEach((id) => {
      if (bulkEditField === "category") {
        onCategoryChange(id, bulkEditValue)
      } else if (bulkEditField === "merchant") {
        onMerchantChange(id, bulkEditValue)
      }
    })

    // Show success toast
    toast({
      title: `Bulk update complete`,
      description: `Updated ${bulkEditField} to "${bulkEditValue}" for ${selectedExpenses.length} expenses.`,
    })

    // Close dialog and reset
    setIsBulkEditDialogOpen(false)
    setBulkEditField(null)
    setBulkEditValue("")
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expenses</CardTitle>
          {selectedExpenses.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openBulkEditDialog("category")}>
                Recategorize ({selectedExpenses.length})
              </Button>
              <Button variant="outline" size="sm" onClick={() => openBulkEditDialog("merchant")}>
                Edit Merchant ({selectedExpenses.length})
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedExpenses([])}>
                <X className="h-4 w-4 mr-1" />
                Clear Selection
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all expenses"
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Date
                      {sortField === "date" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Card Name</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    <div className="flex items-center">
                      Category
                      {sortField === "category" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("merchant")}>
                    <div className="flex items-center">
                      Merchant
                      {sortField === "merchant" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                    <div className="flex items-center justify-end">
                      Amount
                      {sortField === "amount" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length > 0 ? (
                  <>
                    {/* Total row - moved to the top */}
                    <TableRow className="bg-muted/50 border-b-2 border-border">
                      <TableCell colSpan={4} className="font-medium">
                        Total ({expenses.length} {expenses.length === 1 ? "expense" : "expenses"})
                      </TableCell>
                      <TableCell className="font-medium">Filtered Total</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                      </TableCell>
                    </TableRow>

                    {/* Expense rows */}
                    {expenses.map((expense) => (
                      <TableRow key={expense.id} className={selectedExpenses.includes(expense.id) ? "bg-muted/30" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedExpenses.includes(expense.id)}
                            onCheckedChange={(checked) => handleSelectExpense(expense.id, !!checked)}
                            aria-label={`Select expense ${expense.description}`}
                          />
                        </TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.cardName}</TableCell>
                        <TableCell>
                          {editingCellId === expense.id && editingField === "category" ? (
                            <Select
                              defaultValue={expense.category}
                              onValueChange={(value) => {
                                onCategoryChange(expense.id, value)
                                setEditingCellId(null)
                                setEditingField(null)
                              }}
                              onOpenChange={(open) => {
                                if (!open) {
                                  setEditingCellId(null)
                                  setEditingField(null)
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              variant="outline"
                              className={cn(
                                "cursor-pointer",
                                expense.category === "Restaurant" && "bg-blue-50 text-primary hover:bg-blue-50",
                                expense.category === "Travel" && "bg-teal-50 text-teal-700 hover:bg-teal-50",
                                expense.category === "Taxi" && "bg-amber-50 text-amber-700 hover:bg-amber-50",
                                expense.category === "Phone & Internet" &&
                                  "bg-indigo-50 text-indigo-700 hover:bg-indigo-50",
                              )}
                              onClick={() => {
                                setEditingCellId(expense.id)
                                setEditingField("category")
                              }}
                            >
                              {expense.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCellId === expense.id && editingField === "merchant" ? (
                            <Select
                              defaultValue={expense.merchant}
                              onValueChange={(value) => {
                                onMerchantChange(expense.id, value)
                                setEditingCellId(null)
                                setEditingField(null)
                              }}
                              onOpenChange={(open) => {
                                if (!open) {
                                  setEditingCellId(null)
                                  setEditingField(null)
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {merchants.map((merchant) => (
                                  <SelectItem key={merchant} value={merchant}>
                                    {merchant}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div
                              className="flex items-center cursor-pointer hover:text-primary"
                              onClick={() => {
                                setEditingCellId(expense.id)
                                setEditingField("merchant")
                              }}
                            >
                              {expense.merchant}
                              <Edit className="ml-2 h-3.5 w-3.5 opacity-50" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Edit Dialog */}
      <Dialog open={isBulkEditDialogOpen} onOpenChange={setIsBulkEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{bulkEditField === "category" ? "Bulk Recategorize" : "Bulk Edit Merchant"}</DialogTitle>
            <DialogDescription>
              {bulkEditField === "category"
                ? "Change the category for all selected expenses."
                : "Change the merchant name for all selected expenses."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select onValueChange={setBulkEditValue}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${bulkEditField}`} />
              </SelectTrigger>
              <SelectContent>
                {bulkEditField === "category"
                  ? categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  : merchants.map((merchant) => (
                      <SelectItem key={merchant} value={merchant}>
                        {merchant}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>

            <p className="mt-2 text-sm text-muted-foreground">
              This will update {selectedExpenses.length} selected expenses.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEdit} disabled={!bulkEditValue}>
              <Check className="mr-2 h-4 w-4" />
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
