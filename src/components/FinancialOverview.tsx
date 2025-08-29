import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatPercent, calculateFinancialHealth } from "@/lib/utils"
import { TrendingUp, TrendingDown, DollarSign, Target, PiggyBank, CreditCard } from "lucide-react"

interface FinancialData {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  totalDebt: number
  monthlyBudget: number
  spentThisMonth: number
  savingsGoal: number
  currentSavings: number
}

interface FinancialOverviewProps {
  data: FinancialData
}

export function FinancialOverview({ data }: FinancialOverviewProps) {
  const {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalDebt,
    monthlyBudget,
    spentThisMonth,
    savingsGoal,
    currentSavings
  } = data

  const budgetProgress = (spentThisMonth / monthlyBudget) * 100
  const savingsProgress = (currentSavings / savingsGoal) * 100
  const healthScore = calculateFinancialHealth({
    totalIncome,
    totalExpenses,
    totalSavings,
    totalDebt
  })

  const netWorth = totalSavings - totalDebt
  const monthlyLeftOver = totalIncome - totalExpenses

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Financial Health Score */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Health Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{Math.round(healthScore)}/100</div>
          <Progress value={healthScore} className="mt-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {healthScore >= 80 ? "Excellent financial health!" 
             : healthScore >= 60 ? "Good financial health with room for improvement"
             : healthScore >= 40 ? "Fair financial health - focus on reducing expenses"
             : "Poor financial health - immediate attention needed"}
          </p>
        </CardContent>
      </Card>

      {/* Net Worth */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          {netWorth >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netWorth)}
          </div>
          <p className="text-xs text-muted-foreground">
            Assets - Debts
          </p>
        </CardContent>
      </Card>

      {/* Monthly Cash Flow */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${monthlyLeftOver >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(monthlyLeftOver)}
          </div>
          <p className="text-xs text-muted-foreground">
            Income - Expenses
          </p>
        </CardContent>
      </Card>

      {/* Budget Progress */}
      <Card className="col-span-full md:col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{formatCurrency(spentThisMonth)}</span>
            <span className="text-sm text-muted-foreground">
              of {formatCurrency(monthlyBudget)}
            </span>
          </div>
          <Progress 
            value={budgetProgress} 
            className={`mt-3 ${budgetProgress > 90 ? 'bg-red-100' : budgetProgress > 70 ? 'bg-yellow-100' : ''}`}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {budgetProgress > 100 
              ? `Over budget by ${formatCurrency(spentThisMonth - monthlyBudget)}`
              : `${formatCurrency(monthlyBudget - spentThisMonth)} remaining`}
          </p>
        </CardContent>
      </Card>

      {/* Savings Goal Progress */}
      <Card className="col-span-full md:col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{formatCurrency(currentSavings)}</span>
            <span className="text-sm text-muted-foreground">
              of {formatCurrency(savingsGoal)}
            </span>
          </div>
          <Progress value={savingsProgress} className="mt-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {savingsProgress >= 100 
              ? "Goal achieved! 🎉"
              : `${formatPercent(savingsProgress)} complete - ${formatCurrency(savingsGoal - currentSavings)} to go`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}