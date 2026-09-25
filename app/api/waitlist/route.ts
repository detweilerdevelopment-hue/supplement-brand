import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'node:crypto';
import { db } from '../../../lib/database';
export const runtime='nodejs';
export async function POST(request: NextRequest) {
  const origin=request.headers.get('origin');
  if(origin && origin!==request.nextUrl.origin && origin!==process.env.SITE_URL) return NextResponse.json({error:'Request origin is not allowed.'},{status:403});
  try {
    const body=await request.text();
    if(body.length>2048) return NextResponse.json({error:'Request is too large.'},{status:413});
    let data; try{data=JSON.parse(body);}catch{return NextResponse.json({error:'Invalid request.'},{status:400});}
    if(!data || typeof data!=='object') return NextResponse.json({error:'Invalid request.'},{status:400});
    if(data.company) return NextResponse.json({success:true});
    const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';
    if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || data.consent!==true) return NextResponse.json({error:'Please enter a valid email address and agree to receive updates.'},{status:400});
    const database=db();const now=Date.now();
    // Only trust forwarded IPs when a controlled reverse proxy replaces that header.
    const address=process.env.TRUST_PROXY==='true'?(request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown'):'local';
    const key=createHash('sha256').update(address).digest('hex');
    database.prepare('DELETE FROM limits WHERE expires < ?').run(now);
    database.prepare('INSERT INTO limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,now+600000);
    const limit=database.prepare('SELECT count FROM limits WHERE key=?').get(key) as {count:number};
    if(limit.count>20) return NextResponse.json({error:'Too many attempts. Please try again in 10 minutes.'},{status:429,headers:{'Retry-After':'600'}});
    const token=randomBytes(32).toString('hex');
    const result=database.prepare('INSERT OR IGNORE INTO subscribers (email,token,created_at,consent_version) VALUES (?,?,?,?)').run(email,token,new Date().toISOString(),'2026-09-25');
    // Never disclose an existing subscriber’s private removal token.
    return NextResponse.json({success:true,unsubscribe:result.changes?`/unsubscribe?token=${token}`:undefined},{headers:{'Cache-Control':'no-store'}});
  }catch{console.error('Waitlist storage failed');return NextResponse.json({error:'We couldn’t save your signup. Please try again shortly.'},{status:503});}
}
