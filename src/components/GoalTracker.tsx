import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Target, Plus, Calendar, DollarSign, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: "emergency" | "vacation" | "house" | "retirement" | "debt" | "other"
  priority: "high" | "medium" | "low"
  monthlyContribution: number
  progress: number
  status: "on-track" | "ahead" | "behind" | "completed"
}

interface GoalTrackerProps {
  goals: Goal[]
}

export function GoalTracker({ goals: initialGoals }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    category: "other" as Goal['category'],
    monthlyContribution: ""
  })

  const addGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category,
        priority: "medium",
        monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
        progress: 0,
        status: "on-track"
      }
      setGoals(prev => [...prev, goal])
      setNewGoal({
        title: "",
        targetAmount: "",
        deadline: "",
        category: "other",
        monthlyContribution: ""
      })
      setShowAddForm(false)
    }
  }

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const newCurrentAmount = goal.currentAmount + amount
        const progress = (newCurrentAmount / goal.targetAmount) * 100
        const status = progress >= 100 ? "completed" : 
                     progress >= 80 ? "ahead" : 
                     progress >= 40 ? "on-track" : "behind"
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          progress,
          status
        }
      }
      return goal
    }))
  }

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case "emergency": return "🚨"
      case "vacation": return "✈️"
      case "house": return "🏠"
      case "retirement": return "📈"
      case "debt": return "💳"
      default: return "🎯"
    }
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50"
      case "ahead": return "text-blue-600 bg-blue-50"
      case "on-track": return "text-green-600 bg-green-50"
      case "behind": return "text-red-600 bg-red-50"
    }
  }


  const completedGoals = goals.filter(g => g.status === "completed")
  const activeGoals = goals.filter(g => g.status !== "completed")
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals Overview
            </CardTitle>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(totalCurrentAmount)}</div>
              <div className="text-sm text-muted-foreground">Total Saved</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {formatCurrency(totalCurrentAmount)} of {formatCurrency(totalTargetAmount)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Goal Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({...prev, title: e.target.value}))}
              />
              <Input
                type="number"
                placeholder="Target amount"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal(prev => ({...prev, targetAmount: e.target.value}))}
              />
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({...prev, deadline: e.target.value}))}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({...prev, category: e.target.value as Goal['category']}))}
              >
                <option value="emergency">Emergency Fund</option>
                <option value="vacation">Vacation</option>
                <option value="house">House Purchase</option>
                <option value="retirement">Retirement</option>
                <option value="debt">Debt Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              type="number"
              placeholder="Monthly contribution (optional)"
              value={newGoal.monthlyContribution}
              onChange={(e) => setNewGoal(prev => ({...prev, monthlyContribution: e.target.value}))}
            />
            <div className="flex gap-2">
              <Button onClick={addGoal} className="flex-1">
                Add Goal
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h4 className="font-semibold">{goal.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(goal.deadline))}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(goal.monthlyContribution)}/month
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                  {goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{goal.progress.toFixed(1)}% complete</span>
                  <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} remaining</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Add amount"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const amount = parseFloat((e.target as HTMLInputElement).value)
                      if (amount > 0) {
                        updateGoalProgress(goal.id, amount);
                        (e.target as HTMLInputElement).value = ""
                      }
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector(`input[placeholder="Add amount"]`) as HTMLInputElement
                    const amount = parseFloat(input?.value || "0")
                    if (amount > 0) {
                      updateGoalProgress(goal.id, amount)
                      input.value = ""
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
          
          {activeGoals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active goals yet. Create your first goal to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="p-3 border rounded-lg bg-green-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(goal.targetAmount)} completed
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}