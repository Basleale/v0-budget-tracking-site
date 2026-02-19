'use client'

import { useState, useEffect } from 'react'
import BudgetHeader from '@/components/BudgetHeader'
import BudgetStats from '@/components/BudgetStats'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import CategoryChart from '@/components/CategoryChart'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { InfoIcon, WalletIcon, Eye, EyeOff, X, Share } from 'lucide-react'

interface Transaction {
  id: string; description: string; amount: number; category: string; date: string; emoji: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0)
  const [isBudgetVisible, setIsBudgetVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isStandalone, setIsStandalone] = useState(false)
  
  // PWA Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // Detect standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!standalone);

    // Handle Android/Chrome Prompt
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);

    // Persistence
    const savedTxs = localStorage.getItem('genzeb_transactions');
    const savedBudget = localStorage.getItem('genzeb_monthly_budget');
    if (savedTxs) setTransactions(JSON.parse(savedTxs));
    if (savedBudget) setMonthlyBudget(parseFloat(savedBudget));
    
    setIsLoading(false);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('genzeb_transactions', JSON.stringify(transactions));
      localStorage.setItem('genzeb_monthly_budget', monthlyBudget.toString());
    }
  }, [transactions, monthlyBudget, isLoading]);

  const handleInstallAction = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setShowIOSGuide(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("To install, use your browser menu and select 'Add to Home Screen'");
    }
  };

  // Adaptive Budget Logic
  const calculateDailyStatus = () => {
    if (monthlyBudget <= 0) return { todayLimit: 0, todaySpent: 0, isOver: false };
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let totalWeights = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(now.getFullYear(), now.getMonth(), i).getDay();
      totalWeights += (day === 0 || day === 6) ? 1.5 : 1;
    }
    const unit = monthlyBudget / totalWeights;
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const todayLimit = unit * (isWeekend ? 1.5 : 1);
    const todaySpent = transactions.filter(t => t.date === now.toISOString().split('T')[0]).reduce((s, t) => s + t.amount, 0);
    return { todayLimit, todaySpent, isOver: todaySpent > todayLimit };
  };

  const { todayLimit, todaySpent, isOver } = calculateDailyStatus();
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = monthlyBudget - totalSpent;

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-accent animate-pulse">💰 Loading...</div>;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 pb-20">
        <BudgetHeader onInstall={handleInstallAction} isStandalone={isStandalone} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Monthly Budget Input */}
          <div className="mb-6 p-6 rounded-2xl border border-border/30 bg-secondary/20 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <WalletIcon className="text-primary h-6 w-6" />
              <h2 className="text-xl font-bold">Monthly Budget (Birr)</h2>
            </div>
            <Input 
              type="number" 
              value={monthlyBudget || ''}
              onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
              className="max-w-xs bg-input border-primary/20 text-lg font-bold h-12"
            />
          </div>

          {/* Hideable Genzeb Left Section */}
          <div className="mb-8">
            <div className="p-8 rounded-3xl border border-border/30 bg-gradient-to-br from-secondary/40 to-transparent backdrop-blur-xl relative overflow-hidden group border-glow-blue">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Genzeb Remaining</h3>
                <button onClick={() => setIsBudgetVisible(!isBudgetVisible)} className="p-2 bg-white/5 rounded-full">
                  {isBudgetVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-black transition-all duration-700 ${isBudgetVisible ? 'blur-0' : 'blur-2xl opacity-10'}`}>
                  {remainingBudget.toFixed(2)}
                </span>
                <span className="text-xl font-bold text-primary">Birr</span>
              </div>
              {monthlyBudget > 0 && (
                <div className="mt-8 h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${remainingBudget < 0 ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${Math.min(100, (totalSpent / monthlyBudget) * 100)}%` }} />
                </div>
              )}
            </div>
          </div>

          {/* Surpass Alerts */}
          <div className="space-y-4 mb-10">
            {monthlyBudget > 0 && isOver && (
              <Alert variant="destructive" className="border-glow-red bg-accent/5 animate-slide-in rounded-2xl">
                <InfoIcon className="h-5 w-5" />
                <AlertTitle className="font-black uppercase text-xs tracking-widest">Daily Limit Exceeded</AlertTitle>
                <AlertDescription className="font-medium mt-1">
                  Today's limit is {todayLimit.toFixed(2)} Birr. You spent {todaySpent.toFixed(2)}. Chill out bru!
                </AlertDescription>
              </Alert>
            )}
            {remainingBudget < 0 && (
              <Alert variant="destructive" className="border-glow-red bg-accent/10 animate-pulse rounded-2xl border-2">
                <AlertTitle className="font-black text-lg">CRITICAL OVERSPENDING!</AlertTitle>
                <AlertDescription>Stop wasting money, you are {Math.abs(remainingBudget).toFixed(2)} Birr over budget!</AlertDescription>
              </Alert>
            )}
          </div>

          <BudgetStats totalSpent={totalSpent} transactionCount={transactions.length} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-1 space-y-8">
              <TransactionForm onAddTransaction={(tx) => setTransactions([{...tx, id: Date.now().toString()}, ...transactions])} />
              {transactions.length > 0 && <CategoryChart data={transactions.reduce((acc, t) => {
                const ex = acc.find(i => i.category === t.category);
                if (ex) ex.amount += t.amount; else acc.push({category: t.category, amount: t.amount, emoji: t.emoji});
                return acc;
              }, [] as any[])} />}
            </div>
            <div className="lg:col-span-2">
              <TransactionList transactions={transactions} onDeleteTransaction={(id) => setTransactions(transactions.filter(t => t.id !== id))} />
            </div>
          </div>
        </div>
      </div>

      {/* Try Galaxy Style IOS Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-secondary w-full max-w-md rounded-t-[2.5rem] p-8 pb-12 relative animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setShowIOSGuide(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full"><X size={20}/></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-blue">💰</div>
              <h2 className="text-2xl font-black">Install Budget Birr</h2>
              <p className="text-muted-foreground mt-2">Run Genzeb Zapa in fullscreen</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                <div className="bg-primary/20 p-2 rounded-lg text-primary"><Share size={24}/></div>
                <p className="text-sm font-bold">1. Tap the Share button in Safari</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                <div className="bg-primary/20 p-2 rounded-lg text-primary font-bold text-xl">+</div>
                <p className="text-sm font-bold">2. Select 'Add to Home Screen'</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}