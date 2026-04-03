import { NextResponse } from 'next/server';
import { insertResponse } from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.json();
    const id = await insertResponse(data);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error inserting response:', error);
    return NextResponse.json({ success: false, error: 'Failed to insert response' }, { status: 500 });
  }
}
