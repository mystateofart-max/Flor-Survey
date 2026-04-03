import { NextResponse } from 'next/server';
import { getResponses } from '@/lib/db';

export async function GET() {
  try {
    const responses = await getResponses();
    return NextResponse.json(responses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
