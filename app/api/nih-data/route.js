import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'nih_2025.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    return NextResponse.json({ data: fileContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}