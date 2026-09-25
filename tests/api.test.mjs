import {test} from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://localhost:3000';
const post=(path,data,headers={})=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(data)});
test('signup validation, persistence, duplicates, and removal',async()=>{
 const invalid=await post('/api/waitlist',{email:'invalid',consent:true});assert.equal(invalid.status,400);
 const cross=await post('/api/waitlist',{email:'a@example.com',consent:true},{Origin:'https://other.example'});assert.equal(cross.status,403);
 const noConsent=await post('/api/waitlist',{email:'a@example.com'});assert.equal(noConsent.status,400);
 const email=`test-${Date.now()}@example.com`;
 const valid=await post('/api/waitlist',{email,consent:true});assert.equal(valid.status,200);const result=await valid.json();assert.match(result.unsubscribe,/token=[a-f0-9]{64}/);
 const duplicate=await post('/api/waitlist',{email,consent:true});const dup=await duplicate.json();assert.equal(dup.success,true);assert.equal(dup.unsubscribe,undefined);
 const token=new URL(result.unsubscribe,base).searchParams.get('token');const deleted=await post('/api/unsubscribe',{token});assert.equal(deleted.status,200);
 const rejoin=await post('/api/waitlist',{email,consent:true});const fresh=await rejoin.json();assert.ok(fresh.unsubscribe);await post('/api/unsubscribe',{token:new URL(fresh.unsubscribe,base).searchParams.get('token')});
 const bad=await post('/api/unsubscribe',{token:'bad'});assert.equal(bad.status,400);
});
test('pages and SEO endpoints are available',async()=>{for(const path of ['/','/privacy','/unsubscribe','/robots.txt','/sitemap.xml','/product.svg']){const res=await fetch(base+path);assert.equal(res.status,200,path);}});
