'use client'

import { Download } from 'lucide-react'

interface BudgetHeaderProps {
  onInstall?: () => void;
}

export default function BudgetHeader({ onInstall }: BudgetHeaderProps) {
  return (
    <header className="relative border-b border-border/30 bg-gradient-to-b from-secondary/40 to-background backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
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

            <p
              className="text-lg text-muted-foreground max-w-2xl animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}
            >
              Track every Santim and Birr. Your personalized Genzeb zapa is here. 💸
            </p>

            <div
              className="mt-6 flex gap-4 animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary glow-blue animate-pulse"></div>
                <span className="text-muted-foreground">Real-time tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent glow-red animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-muted-foreground">Smart categories</span>
              </div>
            </div>
          </div>

          {onInstall && (
            <button
              onClick={onInstall}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all duration-300 glow-blue animate-fadeInUp hover:scale-105 active:scale-95 self-start md:self-center"
            >
              <Download size={20} />
              Add to Home Screen
            </button>
          )}
        </div>
      </div>
    </header>
  )
}