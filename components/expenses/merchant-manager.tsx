"use client"

import { useState } from "react"
import { Edit, Plus, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface MerchantRule {
  keyword: string
  merchantName: string
}

interface MerchantManagerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  merchants: string[]
  setMerchants: (merchants: string[]) => void
  merchantRules: MerchantRule[]
  setMerchantRules: (rules: MerchantRule[]) => void
}

export function MerchantManager({
  isOpen,
  setIsOpen,
  merchants,
  setMerchants,
  merchantRules,
  setMerchantRules,
}: MerchantManagerProps) {
  const [newMerchant, setNewMerchant] = useState("")
  const [editingMerchant, setEditingMerchant] = useState<{ index: number; value: string }>({ index: -1, value: "" })

  // Rule creation states
  const [newRuleKeyword, setNewRuleKeyword] = useState("")
  const [newRuleMerchant, setNewRuleMerchant] = useState("")

  const addMerchant = () => {
    if (!newMerchant.trim()) return

    if (merchants.includes(newMerchant.trim())) {
      toast({
        title: "Merchant already exists",
        description: `"${newMerchant.trim()}" is already in your merchants.`,
        variant: "destructive",
      })
      return
    }

    setMerchants([...merchants, newMerchant.trim()])
    setNewMerchant("")

    toast({
      title: "Merchant added",
      description: `"${newMerchant.trim()}" has been added to your merchants.`,
    })
  }

  const startEditMerchant = (index: number) => {
    setEditingMerchant({ index, value: merchants[index] })
  }

  const saveEditMerchant = () => {
    if (!editingMerchant.value.trim()) return

    if (
      merchants.includes(editingMerchant.value.trim()) &&
      merchants[editingMerchant.index] !== editingMerchant.value.trim()
    ) {
      toast({
        title: "Merchant already exists",
        description: `"${editingMerchant.value.trim()}" is already in your merchants.`,
        variant: "destructive",
      })
      return
    }

    const oldMerchant = merchants[editingMerchant.index]
    const newMerchants = [...merchants]
    newMerchants[editingMerchant.index] = editingMerchant.value.trim()
    setMerchants(newMerchants)

    // Update any rules that use this merchant
    const updatedRules = merchantRules.map((rule) => {
      if (rule.merchantName === oldMerchant) {
        return { ...rule, merchantName: editingMerchant.value.trim() }
      }
      return rule
    })
    setMerchantRules(updatedRules)

    setEditingMerchant({ index: -1, value: "" })

    toast({
      title: "Merchant updated",
      description: `"${oldMerchant}" has been renamed to "${editingMerchant.value.trim()}".`,
    })
  }

  const deleteMerchant = (index: number) => {
    const merchantToDelete = merchants[index]

    // Check if merchant is used in any rules
    const rulesUsingMerchant = merchantRules.filter((rule) => rule.merchantName === merchantToDelete)
    if (rulesUsingMerchant.length > 0) {
      toast({
        title: "Cannot delete merchant",
        description: `"${merchantToDelete}" is used in ${rulesUsingMerchant.length} rules. Please delete those rules first.`,
        variant: "destructive",
      })
      return
    }

    const newMerchants = [...merchants]
    newMerchants.splice(index, 1)
    setMerchants(newMerchants)

    toast({
      title: "Merchant deleted",
      description: `"${merchantToDelete}" has been removed from your merchants.`,
    })
  }

  const addRule = () => {
    if (!newRuleKeyword.trim() || !newRuleMerchant) {
      toast({
        title: "Invalid rule",
        description: "Both keyword and merchant must be specified.",
        variant: "destructive",
      })
      return
    }

    // Check if rule already exists
    const ruleExists = merchantRules.some((rule) => rule.keyword.toLowerCase() === newRuleKeyword.trim().toLowerCase())

    if (ruleExists) {
      toast({
        title: "Rule already exists",
        description: `A rule for keyword "${newRuleKeyword.trim()}" already exists.`,
        variant: "destructive",
      })
      return
    }

    const newRule: MerchantRule = {
      keyword: newRuleKeyword.trim(),
      merchantName: newRuleMerchant,
    }

    setMerchantRules([...merchantRules, newRule])
    setNewRuleKeyword("")
    setNewRuleMerchant("")

    toast({
      title: "Rule added",
      description: `New rule created: When description contains "${newRuleKeyword.trim()}", merchant will be set to "${newRuleMerchant}".`,
    })
  }

  const deleteRule = (index: number) => {
    const ruleToDelete = merchantRules[index]
    const newRules = [...merchantRules]
    newRules.splice(index, 1)
    setMerchantRules(newRules)

    toast({
      title: "Rule deleted",
      description: `Rule for keyword "${ruleToDelete.keyword}" has been deleted.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Merchants</DialogTitle>
          <DialogDescription>
            Add, edit, or delete merchants and create rules for automatic assignment.
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="merchants">
            <AccordionTrigger>Merchants</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Add new merchant */}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New merchant name"
                    value={newMerchant}
                    onChange={(e) => setNewMerchant(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addMerchant()
                      }
                    }}
                  />
                  <Button onClick={addMerchant} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Merchant list */}
                <div className="border rounded-md">
                  {merchants.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No merchants yet. Add your first merchant above.
                    </div>
                  ) : (
                    <div className="divide-y max-h-[300px] overflow-y-auto">
                      {merchants.map((merchant, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          {editingMerchant.index === index ? (
                            <Input
                              value={editingMerchant.value}
                              onChange={(e) => setEditingMerchant({ ...editingMerchant, value: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  saveEditMerchant()
                                }
                              }}
                              autoFocus
                              className="flex-1 mr-2"
                            />
                          ) : (
                            <span className="flex-1">{merchant}</span>
                          )}

                          <div className="flex items-center space-x-1">
                            {editingMerchant.index === index ? (
                              <Button onClick={saveEditMerchant} size="sm" variant="ghost">
                                Save
                              </Button>
                            ) : (
                              <>
                                <Button onClick={() => startEditMerchant(index)} size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteMerchant(index)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rules">
            <AccordionTrigger>Merchant Rules</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Create rules to automatically assign merchants based on keywords in the description.
                </div>

                {/* Add new rule */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="col-span-1 md:col-span-1">
                    <Input
                      placeholder="Keyword in description"
                      value={newRuleKeyword}
                      onChange={(e) => setNewRuleKeyword(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newRuleMerchant}
                      onChange={(e) => setNewRuleMerchant(e.target.value)}
                    >
                      <option value="">Select merchant</option>
                      {merchants.map((merchant, index) => (
                        <option key={index} value={merchant}>
                          {merchant}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <Button onClick={addRule} className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Rule
                    </Button>
                  </div>
                </div>

                {/* Rules list */}
                <div className="border rounded-md">
                  {merchantRules.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No rules yet. Add your first rule above.
                    </div>
                  ) : (
                    <div className="divide-y max-h-[300px] overflow-y-auto">
                      {merchantRules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div className="flex-1 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">"{rule.keyword}"</div>
                              <div className="text-sm text-muted-foreground">→ {rule.merchantName}</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteRule(index)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
