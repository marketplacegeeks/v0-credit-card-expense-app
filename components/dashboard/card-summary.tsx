"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CardData {
  name: string
  nextPayment: string
  dueDate: string
}

interface CardSummaryProps {
  data: CardData[]
}

export function CardSummary({ data }: CardSummaryProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Card Summary</CardTitle>
        <CardDescription>Overview of your credit cards and upcoming payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card Name</TableHead>
              <TableHead>Next Payment Due</TableHead>
              <TableHead>Payment Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((card) => (
              <TableRow key={card.name}>
                <TableCell className="font-medium">{card.name}</TableCell>
                <TableCell>{card.nextPayment}</TableCell>
                <TableCell>{card.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
