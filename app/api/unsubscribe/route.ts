import { NextRequest,NextResponse } from 'next/server';
import { db } from '../../../lib/database';
export const runtime='nodejs';
export async function POST(request:NextRequest){
  try{const {token}=await request.json();if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return NextResponse.json({error:'This removal link is invalid.'},{status:400});
    db().prepare('DELETE FROM subscribers WHERE token=?').run(token);return NextResponse.json({success:true});
  }catch{return NextResponse.json({error:'Unable to process this request. Please try again.'},{status:503});}
}
