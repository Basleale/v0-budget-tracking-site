'use client'

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
      <div
        className="relative p-8 rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm flex flex-col items-center justify-center min-h-96 animate-fadeInUp"
      >
        <div
          className="text-6xl mb-4 animate-bounce"
        >
          🎉
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No spending yet!</h3>
        <p className="text-muted-foreground text-center max-w-xs">
          Great! You haven't logged any expenses. When you do, they'll appear here.
        </p>
      </div>
    )
  }

  return (
    <div
      className="relative rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm overflow-hidden animate-fadeInUp"
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
        {sortedDates.map((date, dateIndex) => (
          <div key={date} className="border-b border-border/20 last:border-b-0">
            {/* Date Header */}
            <div className="px-6 py-4 bg-secondary/20 sticky top-0 z-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                {formatDate(date)} • {getDaysAgo(date)}
              </p>
            </div>

            {/* Transactions for this date */}
            <div className="divide-y divide-border/10">
              {groupedTransactions[date].map((transaction, transactionIndex) => (
                <div
                  key={transaction.id}
                  className="px-6 py-4 flex items-center justify-between group transition-colors duration-200 hover:bg-accent/5 animate-fadeInUp"
                  style={{ animationDelay: `${(dateIndex + transactionIndex) * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Category Emoji and Name */}
                    <div className="flex-shrink-0">
                      <div
                        className="text-2xl animate-pulse"
                        style={{ animationDelay: `${transactionIndex * 0.1}s` }}
                      >
                        {transaction.emoji}
                      </div>
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
                    <div
                      className="text-right hover:scale-105 transition-transform duration-200"
                    >
                      <p className="font-bold text-lg text-accent">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 hover:scale-110 active:scale-90"
                      title="Delete transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent pointer-events-none"></div>
    </div>
  )
}
