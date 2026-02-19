'use client'

interface CategoryData {
  category: string
  amount: number
  emoji: string
}

interface CategoryChartProps {
  data: CategoryData[]
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  const sortedData = [...data].sort((a, b) => b.amount - a.amount)

  const getPercentage = (amount: number) => {
    return Math.round((amount / total) * 100)
  }

  const colors = [
    { progress: 'from-accent' },
    { progress: 'from-primary' },
    { progress: 'from-blue-500' },
    { progress: 'from-red-600' },
    { progress: 'from-blue-600' },
    { progress: 'from-red-700' },
    { progress: 'from-blue-700' },
    { progress: 'from-red-800' },
  ]

  return (
    <div
      className="relative p-6 rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm overflow-hidden group animate-fadeInUp"
    >
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at bottom-left, rgba(239, 68, 68, 0.2), transparent)',
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">📈</div>
          <h2 className="text-xl font-bold text-foreground">Spending by Category</h2>
        </div>

        <div className="space-y-4">
          {sortedData.map((item, index) => {
            const percentage = getPercentage(item.amount)
            const color = colors[index % colors.length]

            return (
              <div
                key={item.category}
                className="group/item animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">
                      ${item.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-secondary/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color.progress} to-transparent rounded-full transition-all duration-800`}
                    style={{ width: `${percentage}%` }}
                  ></div>

                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total Spending Card */}
        <div
          className="mt-6 p-4 rounded-lg border border-accent/30 bg-accent/5 flex items-center justify-between animate-fadeInUp"
          style={{ animationDelay: '0.3s' }}
        >
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total Spent
            </p>
            <p className="text-xl font-bold text-foreground mt-1">
              ${total.toFixed(2)}
            </p>
          </div>
          <div
            className="text-3xl animate-spin"
            style={{ animationDuration: '20s' }}
          >
            💰
          </div>
        </div>
      </div>
    </div>
  )
}
