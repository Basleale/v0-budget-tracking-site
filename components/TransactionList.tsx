'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  emoji: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDeleteTransaction: (id: string) => void
}

export default function TransactionList({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diff = today.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce(
    (acc, transaction) => {
      const dateKey = transaction.date
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(transaction)
      return acc
    },
    {} as Record<string, Transaction[]>
  )

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative p-8 rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm flex flex-col items-center justify-center min-h-96"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h3 className="text-xl font-bold text-foreground mb-2">No spending yet!</h3>
        <p className="text-muted-foreground text-center max-w-xs">
          Great! You haven't logged any expenses. When you do, they'll appear here.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm overflow-hidden"
    >
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <h2 className="text-2xl font-bold text-foreground">
            Recent Spending
          </h2>
        </div>
      </div>

      <div className="divide-y divide-border/10 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {sortedDates.map((date, dateIndex) => (
            <motion.div key={date} className="border-b border-border/20 last:border-b-0">
              {/* Date Header */}
              <div className="px-6 py-4 bg-secondary/20 sticky top-0 z-10">
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                  {formatDate(date)} • {getDaysAgo(date)}
                </p>
              </div>

              {/* Transactions for this date */}
              <div className="divide-y divide-border/10">
                <AnimatePresence>
                  {groupedTransactions[date].map((transaction, transactionIndex) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.3,
                        delay: (dateIndex + transactionIndex) * 0.05,
                      }}
                      whileHover={{ backgroundColor: 'rgba(30, 64, 175, 0.05)' }}
                      className="px-6 py-4 flex items-center justify-between group transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Category Emoji and Name */}
                        <div className="flex-shrink-0">
                          <motion.div
                            className="text-2xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: transactionIndex * 0.1,
                            }}
                          >
                            {transaction.emoji}
                          </motion.div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category}
                          </p>
                        </div>
                      </div>

                      {/* Amount and Delete Button */}
                      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                        <motion.div
                          className="text-right"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="font-bold text-lg text-accent">
                            {formatCurrency(transaction.amount)}
                          </p>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Delete transaction"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent pointer-events-none"></div>
    </motion.div>
  )
}
