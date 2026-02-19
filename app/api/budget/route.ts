import { put, list } from '@vercel/blob'
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
    // List blobs to find our file
    const { blobs } = await list({
      prefix: 'budget-data',
    })

    if (!blobs || blobs.length === 0) {
      return NextResponse.json({ transactions: [] })
    }

    // Get the blob URL and fetch the content
    const blobFile = blobs[0]
    const response = await fetch(blobFile.downloadUrl)
    const text = await response.text()
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
