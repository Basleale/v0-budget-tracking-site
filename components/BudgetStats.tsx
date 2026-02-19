'use client'

import { motion } from 'framer-motion'

interface BudgetStatsProps {
  totalSpent: number
  transactionCount: number
}

export default function BudgetStats({ totalSpent, transactionCount }: BudgetStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const averagePerTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0

  const stats = [
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      emoji: '💸',
      color: 'accent',
      isHighlight: true,
    },
    {
      label: 'Transactions',
      value: transactionCount,
      emoji: '📝',
      color: 'primary',
    },
    {
      label: 'Average Per Item',
      value: formatCurrency(averagePerTransaction),
      emoji: '📊',
      color: 'primary',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div
            className={`relative p-6 rounded-lg border transition-all duration-300 group cursor-pointer
              ${stat.isHighlight
                ? 'border-accent/30 bg-gradient-to-br from-accent/10 to-transparent hover:border-accent/60 glow-red'
                : 'border-border/30 bg-gradient-to-br from-secondary/40 to-transparent hover:border-primary/60'
            }`}
          >
            {/* Animated border */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: stat.isHighlight
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), transparent)'
                  : 'linear-gradient(135deg, rgba(30, 64, 175, 0.2), transparent)',
              }}
            ></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{stat.emoji}</div>
                <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>

              {/* Decorative dot indicator */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  stat.isHighlight ? 'bg-accent' : 'bg-primary'
                } opacity-60`}
              ></motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
