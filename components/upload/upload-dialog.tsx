"use client"
import { useForm } from "react-hook-form"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { DateRange } from "react-day-picker"

interface Card {
  id: string
  name: string
}

interface UploadFormValues {
  card: string
  file: File | null
  statementPeriod?: {
    month?: number
    year?: number
  }
}

interface UploadDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  cards: Card[]
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  onSubmit: (data: UploadFormValues, dateRange: DateRange | undefined) => void
}

export function UploadDialog({ isOpen, setIsOpen, cards, dateRange, setDateRange, onSubmit }: UploadDialogProps) {
  const form = useForm<UploadFormValues>({
    defaultValues: {
      card: "",
      file: null,
      statementPeriod: { month: undefined, year: undefined },
    },
  })

  const handleSubmit = (data: UploadFormValues) => {
    // Convert month/year to a date range if needed
    let dateRange: DateRange | undefined = undefined

    if (data.statementPeriod?.month !== undefined && data.statementPeriod?.year !== undefined) {
      const year = data.statementPeriod.year
      const month = data.statementPeriod.month

      // Create first day of the month
      const from = new Date(year, month, 1)

      // Create last day of the month
      const to = new Date(year, month + 1, 0)

      dateRange = { from, to }
    }

    onSubmit(data, dateRange)
    form.reset()
    setDateRange(dateRange)
  }

  // Generate years from current year to 2030
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Statement</DialogTitle>
          <DialogDescription>Upload your credit card statement PDF or CSV file</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="card"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Month/Year Selector */}
            <FormField
              control={form.control}
              name="statementPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement Period</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        onValueChange={(month) => {
                          const currentValue = field.value || {}
                          const newValue = {
                            month: Number.parseInt(month),
                            year: currentValue.year || new Date().getFullYear(),
                          }
                          field.onChange(newValue)
                        }}
                        defaultValue={field.value?.month?.toString() || new Date().getMonth().toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">January</SelectItem>
                          <SelectItem value="1">February</SelectItem>
                          <SelectItem value="2">March</SelectItem>
                          <SelectItem value="3">April</SelectItem>
                          <SelectItem value="4">May</SelectItem>
                          <SelectItem value="5">June</SelectItem>
                          <SelectItem value="6">July</SelectItem>
                          <SelectItem value="7">August</SelectItem>
                          <SelectItem value="8">September</SelectItem>
                          <SelectItem value="9">October</SelectItem>
                          <SelectItem value="10">November</SelectItem>
                          <SelectItem value="11">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        onValueChange={(year) => {
                          const currentValue = field.value || {}
                          const newValue = {
                            month: currentValue.month !== undefined ? currentValue.month : new Date().getMonth(),
                            year: Number.parseInt(year),
                          }
                          field.onChange(newValue)
                        }}
                        defaultValue={field.value?.year?.toString() || new Date().getFullYear().toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <FormDescription>Select the month and year of this statement</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Statement File</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="statement-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF or CSV (MAX. 10MB)</p>
                        </div>
                        <Input
                          id="statement-file"
                          type="file"
                          className="hidden"
                          accept=".pdf,.csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            onChange(file)
                          }}
                          {...fieldProps}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
