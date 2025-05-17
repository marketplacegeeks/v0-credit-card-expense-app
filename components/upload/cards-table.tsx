"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

interface SavedCard {
  id: string
  name: string
  bank: string
  lastFour: string
  hasPassword: boolean
  addedDate: string
}

interface CardsTableProps {
  cards: SavedCard[]
}

export function CardsTable({ cards }: CardsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Cards</CardTitle>
        <CardDescription>Manage your credit cards for statement uploads</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card Name</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Last 4 Digits</TableHead>
              <TableHead>Password Status</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="font-medium">{card.name}</TableCell>
                <TableCell>{card.bank}</TableCell>
                <TableCell>••••{card.lastFour}</TableCell>
                <TableCell>
                  {card.hasPassword ? (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 hover:bg-teal-50">
                      Saved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                      Not Set
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{card.addedDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
