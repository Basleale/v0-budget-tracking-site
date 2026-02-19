'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  emoji: string
}

interface ExportButtonProps {
  transactions: Transaction[]
}

export default function ExportButton({ transactions }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleExport = async (format: 'json' | 'csv') => {
    if (transactions.length === 0) {
      alert('No transactions to export')
      return
    }

    setIsExporting(true)
    try {
      const response = await fetch('/api/budget/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions,
          format,
        }),
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const data = await response.json()
      
      // Create a temporary link and download
      const link = document.createElement('a')
      const filename = format === 'json' 
        ? `budget-export-${new Date().toISOString().split('T')[0]}.json`
        : `budget-export-${new Date().toISOString().split('T')[0]}.csv`
      
      // For client-side download, we need to create a blob
      const exportData = format === 'json'
        ? JSON.stringify(transactions, null, 2)
        : ['Date,Description,Category,Amount,Emoji', ...transactions.map(t => 
            `"${t.date}","${t.description}","${t.category}","${t.amount}","${t.emoji}"`
          )].join('\n')
      
      const blob = new Blob([exportData], {
        type: format === 'json' ? 'application/json' : 'text/csv',
      })
      
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      setShowMenu(false)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting || transactions.length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <Download size={18} />
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border/30 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeInUp">
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors duration-200 text-foreground font-medium border-b border-border/10 disabled:opacity-50"
          >
            Export as JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors duration-200 text-foreground font-medium disabled:opacity-50"
          >
            Export as CSV
          </button>
        </div>
      )}
    </div>
  )
}
