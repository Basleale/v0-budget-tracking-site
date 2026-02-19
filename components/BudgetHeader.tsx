'use client'

import { motion } from 'framer-motion'

export default function BudgetHeader() {
  return (
    <header className="relative border-b border-border/30 bg-gradient-to-b from-secondary/40 to-background backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Animated border glow effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            Track every peso, rupiah, and dollar. Your personalized money police officer is here. 💸
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 flex gap-4"
          >
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary glow-blue animate-pulse-glow"></div>
              <span className="text-muted-foreground">Real-time tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-accent glow-red animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-muted-foreground">Smart categories</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
