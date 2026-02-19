'use client'

import { useState, useEffect } from 'react'
import BudgetHeader from '@/components/BudgetHeader'
import BudgetStats from '@/components/BudgetStats'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import CategoryChart from '@/components/CategoryChart'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { InfoIcon, WalletIcon } from 'lucide-react'

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
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // Weighted Daily Limit Calculation
  const calculateDailyStatus = () => {
    if (monthlyBudget <= 0) return { todayLimit: 0, todaySpent: 0, isOver: false };

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let totalWeights = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i).getDay();
      totalWeights += (day === 0 || day === 6) ? 1.5 : 1;
    }

    const unitValue = monthlyBudget / totalWeights;
    const isTodayWeekend = now.getDay() === 0 || now.getDay() === 6;
    const todayLimit = unitValue * (isTodayWeekend ? 1.5 : 1);

    const todayString = now.toISOString().split('T')[0];
    const todaySpent = transactions
      .filter(t => t.date === todayString)
      .reduce((sum, t) => sum + t.amount, 0);

    return { todayLimit, todaySpent, isOver: todaySpent > todayLimit };
  };

  const { todayLimit, todaySpent, isOver } = calculateDailyStatus();

  // Load Data from Blob on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/budget');
        const data = await res.json();
        if (data.transactions) setTransactions(data.transactions);
        if (data.monthlyBudget) setMonthlyBudget(data.monthlyBudget);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const syncData = async (txs: Transaction[], budget: number) => {
    await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: txs, monthlyBudget: budget }),
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx = { ...transaction, id: Date.now().toString() };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    syncData(updatedTxs, monthlyBudget);
  };

  const deleteTransaction = (id: string) => {
    const updatedTxs = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTxs);
    syncData(updatedTxs, monthlyBudget);
  };

  const handleBudgetChange = (val: string) => {
    const num = parseFloat(val) || 0;
    setMonthlyBudget(num);
    syncData(transactions, num);
  };

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
          <p className="text-muted-foreground">Syncing your Genzeb...</p>
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
        <BudgetHeader />

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Budget Setting Section */}
          <div className="mb-8 p-6 rounded-lg border border-border/30 bg-secondary/20 flex flex-col md:flex-row items-center gap-4 animate-fadeInUp">
            <div className="flex items-center gap-3 flex-1">
              <WalletIcon className="text-primary h-6 w-6" />
              <h2 className="text-xl font-bold">Monthly Budget (Birr)</h2>
            </div>
            <Input 
              type="number" 
              placeholder="Enter limit..." 
              value={monthlyBudget || ''}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className="max-w-xs bg-input border-primary/20 text-lg font-bold"
            />
          </div>

          {/* Budget Warning Alert */}
          {monthlyBudget > 0 && isOver && (
            <div className="mb-8 animate-slide-in">
              <Alert variant="destructive" className="border-glow-red bg-destructive/10">
                <InfoIcon className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Genzeb Warning!</AlertTitle>
                <AlertDescription className="text-base">
                  Your weighted daily limit is <span className="font-bold">{todayLimit.toFixed(2)} Birr</span>. 
                  You've spent <span className="font-bold underline">{todaySpent.toFixed(2)} Birr</span> already. 
                  Stop wasting money lil bru!
                </AlertDescription>
              </Alert>
            </div>
          )}

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