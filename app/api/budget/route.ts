import { put, get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  emoji: string
}

const BLOB_PATH = 'budget-data.json'

export async function GET(request: NextRequest) {
  try {
    const blob = await get(BLOB_PATH)
    
    if (!blob) {
      return NextResponse.json({ transactions: [] })
    }

    const text = await blob.text()
    const data = JSON.parse(text)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from Blob:', error)
    return NextResponse.json({ transactions: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactions } = body

    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid transactions data' },
        { status: 400 }
      )
    }

    // Save to Blob with overwrite
    await put(BLOB_PATH, JSON.stringify({ transactions, lastSync: new Date().toISOString() }), {
      access: 'private',
      overwrite: true,
    })

    return NextResponse.json({ success: true, synced: true })
  } catch (error) {
    console.error('Error saving to Blob:', error)
    return NextResponse.json(
      { error: 'Failed to sync data' },
      { status: 500 }
    )
  }
}
