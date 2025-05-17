"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Statement {
  id: string
  bank: string
  amountDue: string
  statementDate: string
  dueDate: string
  financeCharge: string
  otherCharges: string
}

interface StatementsTableProps {
  statements: Statement[]
  onDeleteStatements?: (ids: string[]) => void
}

export function StatementsTable({ statements: initialStatements, onDeleteStatements }: StatementsTableProps) {
  const [statements, setStatements] = useState<Statement[]>(
    initialStatements.map((statement, index) => ({
      ...statement,
      id: statement.id || `statement-${index}`,
    })),
  )
  const [selectedStatements, setSelectedStatements] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [statementsToDelete, setStatementsToDelete] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStatements(statements.map((statement) => statement.id))
    } else {
      setSelectedStatements([])
    }
  }

  const handleSelectStatement = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStatements((prev) => [...prev, id])
    } else {
      setSelectedStatements((prev) => prev.filter((statementId) => statementId !== id))
    }
  }

  const confirmDelete = (ids: string[]) => {
    setStatementsToDelete(ids)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    // Call the parent component's delete handler if provided
    if (onDeleteStatements) {
      onDeleteStatements(statementsToDelete)
    }

    // For demo purposes, we'll just remove them from our local state
    setStatements((prev) => prev.filter((statement) => !statementsToDelete.includes(statement.id)))

    // Clear selection
    setSelectedStatements((prev) => prev.filter((id) => !statementsToDelete.includes(id)))

    // Show success toast
    toast({
      title: "Statements deleted",
      description: `${statementsToDelete.length} statement(s) have been deleted.`,
    })

    // Close dialog
    setIsDeleteDialogOpen(false)
    setStatementsToDelete([])
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Statement History</CardTitle>
            <CardDescription>View and manage your uploaded statements</CardDescription>
          </div>
          {selectedStatements.length > 0 && (
            <Button variant="destructive" size="sm" onClick={() => confirmDelete(selectedStatements)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedStatements.length})
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedStatements.length === statements.length && statements.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all statements"
                  />
                </TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Statement Date</TableHead>
                <TableHead>Payment Due Date</TableHead>
                <TableHead>Finance Charge</TableHead>
                <TableHead>Other Charges</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.length > 0 ? (
                statements.map((statement) => (
                  <TableRow key={statement.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStatements.includes(statement.id)}
                        onCheckedChange={(checked) => handleSelectStatement(statement.id, !!checked)}
                        aria-label={`Select statement from ${statement.bank}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{statement.bank}</TableCell>
                    <TableCell>{statement.amountDue}</TableCell>
                    <TableCell>{statement.statementDate}</TableCell>
                    <TableCell>{statement.dueDate}</TableCell>
                    <TableCell>{statement.financeCharge}</TableCell>
                    <TableCell>{statement.otherCharges}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => confirmDelete([statement.id])}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No statements found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {statementsToDelete.length === 1 ? "this statement" : `these ${statementsToDelete.length} statements`}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
