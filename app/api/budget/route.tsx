import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_TOKEN = "vercel_blob_rw_ZDvBPBhAx8vHLOdI_z3BqNT3aYccsOkEBHBBkFSTA74unoA";
const BUDGET_FILE = "budget_data.json";

export async function GET() {
  try {
    const { blobs } = await list({ token: BLOB_TOKEN });
    const fileBlob = blobs.find(b => b.pathname === BUDGET_FILE);
    
    if (!fileBlob) {
      return NextResponse.json({ transactions: [], monthlyBudget: 0 });
    }

    const response = await fetch(fileBlob.url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Overwrites the file to maintain current state
    await put(BUDGET_FILE, JSON.stringify(data), {
      access: 'public',
      token: BLOB_TOKEN,
      addRandomSuffix: false
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save budget data' }, { status: 500 });
  }
}