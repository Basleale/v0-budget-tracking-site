'use client'

import { useState, useEffect, useCallback } from 'react'
import BudgetHeader from '@/components/BudgetHeader'
import BudgetStats from '@/components/BudgetStats'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import CategoryChart from '@/components/CategoryChart'
import ExportButton from '@/components/ExportButton'

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
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  // Load initial data from local storage and cloud
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from cloud first
        const response = await fetch('/api/budget')
        if (response.ok) {
          const data = await response.json()
          if (data.transactions && data.transactions.length > 0) {
            setTransactions(data.transactions)
            localStorage.setItem('transactions', JSON.stringify(data.transactions))
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.error('Error loading from cloud:', error)
      }

      // Fallback to local storage
      const savedTransactions = localStorage.getItem('transactions')
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Sync to cloud whenever transactions change
  const syncToCloud = useCallback(async (updatedTransactions: Transaction[]) => {
    setIsSyncing(true)
    setSyncStatus('syncing')
    
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: updatedTransactions,
        }),
      })

      if (response.ok) {
        setSyncStatus('synced')
        setTimeout(() => setSyncStatus('idle'), 2000)
      } else {
        setSyncStatus('error')
        setTimeout(() => setSyncStatus('idle'), 2000)
      }
    } catch (error) {
      console.error('Error syncing to cloud:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  useEffect(() => {
    // Save to local storage
    localStorage.setItem('transactions', JSON.stringify(transactions))
    
    // Sync to cloud (debounced to avoid too many requests)
    const syncTimeout = setTimeout(() => {
      syncToCloud(transactions)
    }, 1000)

    return () => clearTimeout(syncTimeout)
  }, [transactions, syncToCloud])

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
      {/* Animated background effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <BudgetHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Sync Status Indicator */}
          {syncStatus !== 'idle' && (
            <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 animate-fadeInUp ${
              syncStatus === 'syncing' 
                ? 'bg-primary/10 border border-primary/30 text-primary'
                : syncStatus === 'synced'
                ? 'bg-accent/10 border border-accent/30 text-accent'
                : 'bg-red-500/10 border border-red-500/30 text-red-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                syncStatus === 'syncing' 
                  ? 'bg-primary animate-pulse'
                  : syncStatus === 'synced'
                  ? 'bg-accent'
                  : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {syncStatus === 'syncing' ? 'Syncing to cloud...' : 
                 syncStatus === 'synced' ? 'Data synced to cloud ✓' : 
                 'Sync failed - saving locally'}
              </span>
            </div>
          )}

          {/* Stats Section */}
          <div className="mb-12">
            <BudgetStats totalSpent={totalSpent} transactionCount={transactions.length} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Chart */}
            <div className="lg:col-span-1 space-y-8">
              {/* Add Transaction Form */}
              <div className="animate-slide-in">
                <TransactionForm onAddTransaction={addTransaction} />
              </div>

              {/* Category Breakdown */}
              {categorySpending.length > 0 && (
                <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                  <CategoryChart data={categorySpending} />
                </div>
              )}
            </div>

            {/* Right Column - Transaction List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-end">
                <ExportButton transactions={transactions} />
              </div>
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
