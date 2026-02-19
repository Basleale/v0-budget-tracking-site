'use client'

import { motion } from 'framer-motion'

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
    { bg: 'bg-accent', progress: 'from-accent' },
    { bg: 'bg-primary', progress: 'from-primary' },
    { bg: 'bg-blue-500', progress: 'from-blue-500' },
    { bg: 'bg-red-600', progress: 'from-red-600' },
    { bg: 'bg-blue-600', progress: 'from-blue-600' },
    { bg: 'bg-red-700', progress: 'from-red-700' },
    { bg: 'bg-blue-700', progress: 'from-blue-700' },
    { bg: 'bg-red-800', progress: 'from-red-800' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative p-6 rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm overflow-hidden group"
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
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group/item"
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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${color.progress} to-transparent rounded-full`}
                  ></motion.div>

                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ width: '30%' }}
                  ></motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Total Spending Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-4 rounded-lg border border-accent/30 bg-accent/5 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total Spent
            </p>
            <p className="text-xl font-bold text-foreground mt-1">
              ${total.toFixed(2)}
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-3xl"
          >
            💰
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
