'use client'

import { Download, Smartphone } from 'lucide-react'

interface BudgetHeaderProps {
  onInstall: () => void;
  isStandalone: boolean;
}

export default function BudgetHeader({ onInstall, isStandalone }: BudgetHeaderProps) {
  if (isStandalone) return (
    <header className="relative border-b border-border/30 bg-gradient-to-b from-secondary/40 to-background backdrop-blur-sm pt-12 pb-6">
       <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-accent via-foreground to-primary bg-clip-text text-transparent">
            Genzeb Zapa 👮‍♂️Birr
          </h1>
       </div>
    </header>
  );

  return (
    <header className="relative border-b border-border/30 bg-gradient-to-b from-secondary/40 to-background backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 text-center flex flex-col items-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="relative w-full max-w-2xl">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-black text-balance mb-3">
              <span className="bg-gradient-to-r from-accent via-foreground to-primary bg-clip-text text-transparent">
                Amir Stop Wasting
              </span>
            </h1>
            <h1 className="text-4xl md:text-5xl font-black text-balance mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Money Lil Bru
              </span>
            </h1>
          </div>

          <p className="text-lg text-muted-foreground animate-fadeInUp mx-auto max-w-md" style={{ animationDelay: '0.2s' }}>
            Track every Santim and Birr. Your personalized Genzeb zapa is here. 💸
          </p>

          <button
            onClick={onInstall}
            className="mt-8 flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full transition-all duration-300 glow-blue animate-fadeInUp hover:scale-105 active:scale-95 shadow-xl"
          >
            <Smartphone size={20} />
            Install to Home Screen
          </button>

          <div className="mt-8 flex justify-center gap-6 animate-fadeInUp opacity-60" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-primary glow-blue animate-pulse"></div>
              <span>Offline Persistence</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-accent glow-red animate-pulse"></div>
              <span>Weighted Genzeb Limits</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}