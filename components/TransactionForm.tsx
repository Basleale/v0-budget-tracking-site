'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    description: string
    amount: number
    category: string
    date: string
    emoji: string
  }) => void
}

const categories = [
  { name: 'Food & Drink', emoji: '🍔' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Entertainment', emoji: '🎬' },
  { name: 'Health & Fitness', emoji: '💪' },
  { name: 'Utilities', emoji: '💡' },
  { name: 'Subscriptions', emoji: '🎯' },
  { name: 'Other', emoji: '📌' },
]

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Drink',
    date: new Date().toISOString().split('T')[0],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((c) => c.name === formData.category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    // Simulate a brief delay for feedback
    setTimeout(() => {
      onAddTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        emoji: selectedCategory?.emoji || '📌',
      })

      setFormData({
        description: '',
        amount: '',
        category: 'Food & Drink',
        date: new Date().toISOString().split('T')[0],
      })

      setIsSubmitting(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative p-6 rounded-lg border border-border/30 bg-gradient-to-br from-secondary/40 to-background backdrop-blur-sm overflow-hidden group"
    >
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top-right, rgba(30, 64, 175, 0.2), transparent)',
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">💰</div>
          <h2 className="text-xl font-bold text-foreground">Add Spending</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              What did you buy?
            </label>
            <input
              type="text"
              placeholder="E.g., Coffee at Starbucks"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground transition-all duration-200"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground placeholder-muted-foreground transition-all duration-200"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setFormData({ ...formData, category: category.name })
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    formData.category === category.name
                      ? 'border-primary/60 bg-primary/10 text-foreground glow-blue'
                      : 'border-border/30 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full px-4 py-3 mt-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-red shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-transparent border-t-accent-foreground border-r-accent-foreground rounded-full"
                ></motion.div>
                Adding...
              </span>
            ) : (
              '✨ Add Spending'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
