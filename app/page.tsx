'use client'

import { useState, useEffect } from 'react'
import BudgetHeader from '@/components/BudgetHeader'
import BudgetStats from '@/components/BudgetStats'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import CategoryChart from '@/components/CategoryChart'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  emoji: string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Handle the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
    setIsLoading(false)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions([newTransaction, ...transactions])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

  const categorySpending = transactions.reduce((acc, t) => {
    const existing = acc.find((item) => item.category === t.category)
    if (existing) {
      existing.amount += t.amount
    } else {
      acc.push({ category: t.category, amount: t.amount, emoji: t.emoji })
    }
    return acc
  }, [] as Array<{ category: string; amount: number; emoji: string }>)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow text-center">
          <div className="text-3xl font-bold text-accent mb-4">💰</div>
          <p className="text-muted-foreground">Loading your budget...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <BudgetHeader onInstall={deferredPrompt ? handleInstallClick : undefined} />

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-12">
            <BudgetStats totalSpent={totalSpent} transactionCount={transactions.length} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="animate-slide-in">
                <TransactionForm onAddTransaction={addTransaction} />
              </div>

              {categorySpending.length > 0 && (
                <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                  <CategoryChart data={categorySpending} />
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={deleteTransaction}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}