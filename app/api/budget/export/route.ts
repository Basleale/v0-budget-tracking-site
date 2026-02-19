import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  emoji: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactions, format } = body

    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid transactions data' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString().split('T')[0]
    
    if (format === 'json') {
      const jsonContent = JSON.stringify(transactions, null, 2)
      const filename = `budget-export-${timestamp}.json`
      
      const blob = await put(filename, jsonContent, {
        access: 'public',
        contentType: 'application/json',
      })
      
      return NextResponse.json({ 
        success: true, 
        url: blob.url,
        filename: filename 
      })
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Date,Description,Category,Amount,Emoji\n'
      const csvRows = transactions.map((t: Transaction) => 
        `"${t.date}","${t.description}","${t.category}","${t.amount}","${t.emoji}"`
      ).join('\n')
      const csvContent = csvHeader + csvRows
      const filename = `budget-export-${timestamp}.csv`
      
      const blob = await put(filename, csvContent, {
        access: 'public',
        contentType: 'text/csv',
      })
      
      return NextResponse.json({ 
        success: true, 
        url: blob.url,
        filename: filename 
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use "json" or "csv"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
