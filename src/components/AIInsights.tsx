import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateFinancialInsight, formatCurrency } from "@/lib/utils"
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

interface AIInsightsProps {
  financialData: {
    spending: { category: string; amount: number }[]
    budget: { category: string; limit: number }[]
    totalIncome: number
    totalExpenses: number
    savingsRate: number
  }
}

interface Recommendation {
  type: "save" | "budget" | "invest" | "debt" | "general"
  title: string
  description: string
  impact: string
  actionable: boolean
}

export function AIInsights({ financialData }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const basicInsights = generateFinancialInsight(financialData)
    setInsights(basicInsights)
    generateRecommendations()
  }, [financialData])

  const generateRecommendations = () => {
    const recs: Recommendation[] = []
    const { spending, totalIncome, savingsRate } = financialData

    // Savings recommendations
    if (savingsRate < 0.1) {
      recs.push({
        type: "save",
        title: "Boost Your Emergency Fund",
        description: "Your savings rate is below 10%. Consider automating savings transfers to build your emergency fund.",
        impact: "Could save you $100-500/month",
        actionable: true
      })
    }

    // Budget optimization
    const highestCategory = spending.reduce((max, curr) => 
      curr.amount > max.amount ? curr : max
    )

    if (highestCategory.amount > totalIncome * 0.3) {
      recs.push({
        type: "budget",
        title: `Optimize ${highestCategory.category} Spending`,
        description: `Your ${highestCategory.category} spending is high. Look for alternatives or negotiate better rates.`,
        impact: `Potential savings: ${formatCurrency(highestCategory.amount * 0.1)}/month`,
        actionable: true
      })
    }

    // Investment opportunities
    if (savingsRate > 0.15 && totalIncome > 50000) {
      recs.push({
        type: "invest",
        title: "Consider Investment Opportunities",
        description: "With your healthy savings rate, you might benefit from low-risk investment options.",
        impact: "Potential 5-8% annual returns",
        actionable: true
      })
    }

    // Debt management
    const debtCategories = spending.filter(s => 
      s.category.toLowerCase().includes('debt') || 
      s.category.toLowerCase().includes('loan') ||
      s.category.toLowerCase().includes('credit')
    )

    if (debtCategories.length > 0) {
      const totalDebt = debtCategories.reduce((sum, d) => sum + d.amount, 0)
      recs.push({
        type: "debt",
        title: "Debt Consolidation Strategy",
        description: "Consider consolidating high-interest debts to reduce monthly payments.",
        impact: `Potential savings: ${formatCurrency(totalDebt * 0.05)}/month`,
        actionable: true
      })
    }

    // General financial health
    recs.push({
      type: "general",
      title: "Monthly Financial Review",
      description: "Schedule monthly reviews to track progress and adjust your budget as needed.",
      impact: "Better financial awareness",
      actionable: true
    })

    setRecommendations(recs.slice(0, 4)) // Show top 4 recommendations
  }

  const analyzeWithAI = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis - in real app, this would call Gemini API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiInsights = [
      "Based on your spending patterns, you could save 12% more by switching to a high-yield savings account.",
      "Your grocery spending has increased 23% over the last 3 months. Consider meal planning to optimize costs.",
      "You're on track to meet your savings goal 2 months earlier than planned with current trends."
    ]
    
    setInsights(aiInsights)
    setIsAnalyzing(false)
  }

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case "save": return <Target className="h-4 w-4" />
      case "budget": return <TrendingUp className="h-4 w-4" />
      case "invest": return <ArrowRight className="h-4 w-4" />
      case "debt": return <AlertTriangle className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case "save": return "text-green-600 bg-green-50"
      case "budget": return "text-blue-600 bg-blue-50"
      case "invest": return "text-purple-600 bg-purple-50"
      case "debt": return "text-red-600 bg-red-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Financial Insights</CardTitle>
          </div>
          <Button 
            onClick={analyzeWithAI} 
            disabled={isAnalyzing}
            size="sm"
            className="bg-gradient-primary"
          >
            {isAnalyzing ? "Analyzing..." : "AI Analysis"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{insight}</p>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-sm text-muted-foreground">
                  Analyzing your financial data...
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        {rec.impact}
                      </p>
                    </div>
                  </div>
                  {rec.actionable && (
                    <Button size="sm" variant="ghost" className="ml-2">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}