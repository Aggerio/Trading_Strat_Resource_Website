import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function getGlossaryData() {
  const data = fs.readFileSync(path.join(dataDir, 'glossary.json'), 'utf-8');
  return JSON.parse(data);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  let terms = getGlossaryData();
  
  if (category) {
    terms = terms.filter((t: any) => t.category === category);
  }
  
  if (search) {
    const s = search.toLowerCase();
    terms = terms.filter((t: any) => 
      t.term.toLowerCase().includes(s) || 
      t.definition.toLowerCase().includes(s)
    );
  }
  
  return NextResponse.json(terms);
}