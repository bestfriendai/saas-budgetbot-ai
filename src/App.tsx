import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FinancialOverview } from '@/components/FinancialOverview'
import { SpendingChart } from '@/components/SpendingChart'
import { AIInsights } from '@/components/AIInsights'
import { BudgetManager } from '@/components/BudgetManager'
import { GoalTracker } from '@/components/GoalTracker'
import { Brain, Home, Target, TrendingUp, Settings, Menu, X, Sparkles } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Skip landing page for now - start directly with dashboard

  // Sample financial data
  const financialData = {
    totalIncome: 8500,
    totalExpenses: 6200,
    totalSavings: 15000,
    totalDebt: 3500,
    monthlyBudget: 6000,
    spentThisMonth: 4800,
    savingsGoal: 20000,
    currentSavings: 15000
  }

  const spendingData = {
    categoryData: [
      { category: 'Housing', amount: 2200, budget: 2500, color: '#10b981' },
      { category: 'Food', amount: 800, budget: 700, color: '#f59e0b' },
      { category: 'Transportation', amount: 650, budget: 600, color: '#ef4444' },
      { category: 'Entertainment', amount: 400, budget: 300, color: '#3b82f6' },
      { category: 'Shopping', amount: 750, budget: 500, color: '#8b5cf6' }
    ],
    monthlyData: [
      { month: 'Jan', amount: 5800 },
      { month: 'Feb', amount: 6200 },
      { month: 'Mar', amount: 5900 },
      { month: 'Apr', amount: 6500 },
      { month: 'May', amount: 4800 }
    ]
  }

  const budgetCategories = [
    { 
      id: '1', 
      category: 'Housing', 
      budgeted: 2500, 
      spent: 2200, 
      remaining: 300, 
      percentage: 88, 
      status: 'warning' as const
    },
    { 
      id: '2', 
      category: 'Food & Dining', 
      budgeted: 700, 
      spent: 800, 
      remaining: -100, 
      percentage: 114, 
      status: 'danger' as const
    },
    { 
      id: '3', 
      category: 'Transportation', 
      budgeted: 600, 
      spent: 650, 
      remaining: -50, 
      percentage: 108, 
      status: 'danger' as const
    },
    { 
      id: '4', 
      category: 'Entertainment', 
      budgeted: 300, 
      spent: 400, 
      remaining: -100, 
      percentage: 133, 
      status: 'danger' as const
    },
    { 
      id: '5', 
      category: 'Shopping', 
      budgeted: 500, 
      spent: 750, 
      remaining: -250, 
      percentage: 150, 
      status: 'danger' as const
    }
  ]

  const goals = [
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 7500,
      deadline: '2024-12-31',
      category: 'emergency' as const,
      priority: 'high' as const,
      monthlyContribution: 500,
      progress: 75,
      status: 'on-track' as const
    },
    {
      id: '2',
      title: 'Vacation to Japan',
      targetAmount: 5000,
      currentAmount: 2200,
      deadline: '2024-08-15',
      category: 'vacation' as const,
      priority: 'medium' as const,
      monthlyContribution: 300,
      progress: 44,
      status: 'behind' as const
    },
    {
      id: '3',
      title: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 3200,
      deadline: '2024-10-01',
      category: 'other' as const,
      priority: 'medium' as const,
      monthlyContribution: 400,
      progress: 40,
      status: 'on-track' as const
    }
  ]

  const aiInsightData = {
    spending: spendingData.categoryData.map(item => ({
      category: item.category,
      amount: item.amount
    })),
    budget: spendingData.categoryData.map(item => ({
      category: item.category,
      limit: item.budget
    })),
    totalIncome: financialData.totalIncome,
    totalExpenses: financialData.totalExpenses,
    savingsRate: ((financialData.totalIncome - financialData.totalExpenses) / financialData.totalIncome) * 100
  }

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'budget', name: 'Budget', icon: TrendingUp },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'insights', name: 'AI Insights', icon: Brain },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BudgetBot AI</h1>
                <p className="text-xs text-muted-foreground">Smart Financial Management</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Financial Overview</h2>
                <p className="text-muted-foreground">Your complete financial picture at a glance</p>
              </div>
              <Button className="bg-gradient-primary">
                <Brain className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
            </div>
            <FinancialOverview data={financialData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart 
                categoryData={spendingData.categoryData}
                monthlyData={spendingData.monthlyData}
                viewType="pie"
              />
              <SpendingChart 
                categoryData={spendingData.categoryData}
                monthlyData={spendingData.monthlyData}
                viewType="bar"
              />
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Budget Manager</h2>
              <p className="text-muted-foreground">Track and manage your monthly budget</p>
            </div>
            <BudgetManager 
              categories={budgetCategories}
              totalBudget={financialData.monthlyBudget}
              totalSpent={financialData.spentThisMonth}
            />
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Financial Goals</h2>
              <p className="text-muted-foreground">Set and track your financial objectives</p>
            </div>
            <GoalTracker goals={goals} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">AI Financial Insights</h2>
              <p className="text-muted-foreground">Personalized recommendations powered by AI</p>
            </div>
            <AIInsights financialData={aiInsightData} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Customize your BudgetBot AI experience</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Settings panel with account preferences, notification settings, and data management tools will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
