import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { PlusCircle, Edit3, AlertCircle, CheckCircle, TrendingUp, DollarSign } from "lucide-react"
import { useState } from "react"

interface BudgetCategory {
  id: string
  category: string
  budgeted: number
  spent: number
  remaining: number
  percentage: number
  status: "good" | "warning" | "danger"
}

interface BudgetManagerProps {
  categories: BudgetCategory[]
  totalBudget: number
  totalSpent: number
}

export function BudgetManager({ categories: initialCategories, totalBudget, totalSpent }: BudgetManagerProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [newCategory, setNewCategory] = useState({ name: "", budget: "" })
  const [showAddForm, setShowAddForm] = useState(false)

  const updateBudget = (id: string, newBudget: number) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const remaining = newBudget - cat.spent
        const percentage = (cat.spent / newBudget) * 100
        let status: "good" | "warning" | "danger" = "good"
        
        if (percentage > 100) status = "danger"
        else if (percentage > 80) status = "warning"
        
        return {
          ...cat,
          budgeted: newBudget,
          remaining,
          percentage,
          status
        }
      }
      return cat
    }))
    setIsEditing(null)
  }

  const addCategory = () => {
    if (newCategory.name && newCategory.budget) {
      const budget = parseFloat(newCategory.budget)
      const newCat: BudgetCategory = {
        id: Date.now().toString(),
        category: newCategory.name,
        budgeted: budget,
        spent: 0,
        remaining: budget,
        percentage: 0,
        status: "good"
      }
      setCategories(prev => [...prev, newCat])
      setNewCategory({ name: "", budget: "" })
      setShowAddForm(false)
    }
  }


  const getStatusIcon = (status: "good" | "warning" | "danger") => {
    switch (status) {
      case "good": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "danger": return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const overallProgress = (totalSpent / totalBudget) * 100

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Budget Overview
            </CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
              <div className="text-sm text-muted-foreground">of {formatCurrency(totalBudget)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="mb-4" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className={overallProgress > 100 ? "text-red-600" : overallProgress > 80 ? "text-yellow-600" : "text-green-600"}>
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          {totalSpent > totalBudget && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Over budget by {formatCurrency(totalSpent - totalBudget)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Categories</CardTitle>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Category Form */}
          {showAddForm && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({...prev, name: e.target.value}))}
                />
                <Input
                  type="number"
                  placeholder="Budget amount"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory(prev => ({...prev, budget: e.target.value}))}
                />
                <div className="flex gap-2">
                  <Button onClick={addCategory} size="sm" className="flex-1">
                    Add
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(category.status)}
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(category.spent)} of {formatCurrency(category.budgeted)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.remaining < 0 ? (
                      <span className="text-red-600 font-medium">
                        {formatCurrency(Math.abs(category.remaining))} over
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        {formatCurrency(category.remaining)} left
                      </span>
                    )}
                    {isEditing === category.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 h-8"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => updateBudget(category.id, parseFloat(editValue))}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsEditing(category.id)
                          setEditValue(category.budgeted.toString())
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={Math.min(category.percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.percentage.toFixed(1)}% used</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending up
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}