"use client"

import { useState } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
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

interface CategoryManagerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  categories: string[]
  setCategories: (categories: string[]) => void
}

export function CategoryManager({ isOpen, setIsOpen, categories, setCategories }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<{ index: number; value: string }>({ index: -1, value: "" })

  const addCategory = () => {
    if (!newCategory.trim()) return

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Category already exists",
        description: `"${newCategory.trim()}" is already in your categories.`,
        variant: "destructive",
      })
      return
    }

    setCategories([...categories, newCategory.trim()])
    setNewCategory("")

    toast({
      title: "Category added",
      description: `"${newCategory.trim()}" has been added to your categories.`,
    })
  }

  const startEditCategory = (index: number) => {
    setEditingCategory({ index, value: categories[index] })
  }

  const saveEditCategory = () => {
    if (!editingCategory.value.trim()) return

    if (
      categories.includes(editingCategory.value.trim()) &&
      categories[editingCategory.index] !== editingCategory.value.trim()
    ) {
      toast({
        title: "Category already exists",
        description: `"${editingCategory.value.trim()}" is already in your categories.`,
        variant: "destructive",
      })
      return
    }

    const oldCategory = categories[editingCategory.index]
    const newCategories = [...categories]
    newCategories[editingCategory.index] = editingCategory.value.trim()
    setCategories(newCategories)

    setEditingCategory({ index: -1, value: "" })

    toast({
      title: "Category updated",
      description: `"${oldCategory}" has been renamed to "${editingCategory.value.trim()}".`,
    })
  }

  const deleteCategory = (index: number) => {
    const categoryToDelete = categories[index]

    const newCategories = [...categories]
    newCategories.splice(index, 1)
    setCategories(newCategories)

    toast({
      title: "Category deleted",
      description: `"${categoryToDelete}" has been removed from your categories.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>Add, edit, or delete expense categories.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add new category */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addCategory()
                }
              }}
            />
            <Button onClick={addCategory} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Category list */}
          <div className="border rounded-md">
            {categories.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No categories yet. Add your first category above.
              </div>
            ) : (
              <div className="divide-y">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    {editingCategory.index === index ? (
                      <Input
                        value={editingCategory.value}
                        onChange={(e) => setEditingCategory({ ...editingCategory, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            saveEditCategory()
                          }
                        }}
                        autoFocus
                        className="flex-1 mr-2"
                      />
                    ) : (
                      <span className="flex-1">{category}</span>
                    )}

                    <div className="flex items-center space-x-1">
                      {editingCategory.index === index ? (
                        <Button onClick={saveEditCategory} size="sm" variant="ghost">
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button onClick={() => startEditCategory(index)} size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteCategory(index)}
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

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
