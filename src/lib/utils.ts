import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function calculateFinancialHealth(data: {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  totalDebt: number
}): number {
  const { totalIncome, totalExpenses, totalSavings, totalDebt } = data
  
  if (totalIncome === 0) return 0
  
  const savingsRatio = totalSavings / totalIncome
  const expenseRatio = totalExpenses / totalIncome
  const debtToIncomeRatio = totalDebt / totalIncome
  
  // Calculate health score (0-100)
  let score = 100
  
  // Penalize high expense ratio
  if (expenseRatio > 0.8) score -= 30
  else if (expenseRatio > 0.6) score -= 15
  
  // Reward high savings ratio
  if (savingsRatio > 0.2) score += 10
  else if (savingsRatio < 0.1) score -= 20
  
  // Penalize high debt ratio
  if (debtToIncomeRatio > 0.4) score -= 25
  else if (debtToIncomeRatio > 0.2) score -= 10
  
  return Math.max(0, Math.min(100, score))
}

export function generateFinancialInsight(data: {
  spending: { category: string; amount: number }[]
  budget: { category: string; limit: number }[]
  totalIncome: number
}): string[] {
  const insights: string[] = []
  const { spending, budget, totalIncome } = data
  
  // Check for overspending
  spending.forEach(spend => {
    const budgetItem = budget.find(b => b.category === spend.category)
    if (budgetItem && spend.amount > budgetItem.limit) {
      const overSpent = spend.amount - budgetItem.limit
      insights.push(`You've exceeded your ${spend.category} budget by ${formatCurrency(overSpent)}`)
    }
  })
  
  // Find highest spending category
  const highestSpending = spending.reduce((max, curr) => 
    curr.amount > max.amount ? curr : max
  )
  
  if (highestSpending.amount > totalIncome * 0.3) {
    insights.push(`${highestSpending.category} accounts for a large portion of your spending. Consider reviewing these expenses.`)
  }
  
  // Check savings rate
  const totalSpending = spending.reduce((sum, curr) => sum + curr.amount, 0)
  const savingsRate = (totalIncome - totalSpending) / totalIncome
  
  if (savingsRate < 0.1) {
    insights.push("Your savings rate is below 10%. Try to reduce expenses or increase income.")
  } else if (savingsRate > 0.2) {
    insights.push("Great job! You're saving over 20% of your income.")
  }
  
  return insights.slice(0, 3) // Return top 3 insights
}

export function getSpendingTrend(spending: { date: string; amount: number }[]): "increasing" | "decreasing" | "stable" {
  if (spending.length < 2) return "stable"
  
  const sorted = spending.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, item) => sum + item.amount, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, item) => sum + item.amount, 0) / secondHalf.length
  
  const difference = (secondAvg - firstAvg) / firstAvg
  
  if (difference > 0.1) return "increasing"
  if (difference < -0.1) return "decreasing"
  return "stable"
}