// @vitest-environment node
import {expect,test} from 'vitest';
import type {D1Database} from '@cloudflare/workers-types';
import {SqliteD1} from '../../../../tests/coverage/account-sqlite';
import {handleAccountApi} from '../../api';
import {hashPassword,normalizeLogin,validPassword,verifyPassword} from '../passwords';
import {reservePasswordAttempt} from '../rate-limit';
import {AccountPasswords} from '../store';
const password='A fixture passphrase for testing 2026';
function database(){const db=new SqliteD1();return {db,wire:db as unknown as D1Database};}
function request(action:string,method='POST',body:unknown={login:'fixture.login',password},headers:Record<string,string>={}){return new Request('https://granttap.com/api/account/password/'+action,{method,headers:{'content-type':'application/json',...headers},...(method==='GET'?{}:{body:JSON.stringify(body)})});}

test('password KDF normalizes Unicode, uses strict records and checks the original complete secret',async()=>{
 const secret='A long cafe\u0301 fixture passphrase';const record=await hashPassword(secret);
 expect(await verifyPassword(secret.normalize('NFC'),record)).toBe(true);
 expect(await verifyPassword(secret+' ',record)).toBe(false);
 expect(await verifyPassword(secret,null)).toBe(false);
 for(const bad of ['',record.replace('pbkdf2-sha256','unknown'),record.replace(':600000:',':1:'),'pbkdf2-sha256:600000:invalid:invalid'])expect(await verifyPassword(secret,bad)).toBe(false);
 for(const value of [null,15,'ab','not allowed','/root', '.hidden','a'.repeat(65)])expect(normalizeLogin(value)).toBeNull();
 expect(normalizeLogin(' Review.Fixture ')).toBe('review.fixture');
 expect(validPassword(null)).toBe(false);expect(validPassword('a'.repeat(14))).toBe(false);expect(validPassword('a'.repeat(128))).toBe(true);expect(validPassword('a'.repeat(129))).toBe(false);
});

test('account registration and sign-in apply the same NFC length limit as password storage',async()=>{
 const {wire}=database();const decomposed='e\u0301'.repeat(128);const normalized=decomposed.normalize('NFC');
 expect(Array.from(decomposed).length).toBe(256);expect(Array.from(normalized).length).toBe(128);
 const created=await handleAccountApi(request('register','POST',{login:'unicode.fixture',password:decomposed}),wire);
 expect(created!.status).toBe(201);const account=await created!.json();
 for(const candidate of [decomposed,normalized]){
  const signedIn=await handleAccountApi(request('sign-in','POST',{login:'unicode.fixture',password:candidate}),wire);
  expect(signedIn!.status).toBe(200);expect((await signedIn!.json()).accountId).toBe(account.accountId);
 }
 for(const action of ['register','sign-in']){
  const rejected=await handleAccountApi(request(action,'POST',{login:'too.long.fixture',password:decomposed+'x'}),wire);
  expect(rejected!.status).toBe(400);
 }
});

test('attempt reservations are persistent, expire, and enforce both login and proxy-address budgets',async()=>{
 const {db,wire}=database();const now=Date.now();
 for(let n=0;n<12;n++)expect(await reservePasswordAttempt(wire,'one.login','one.ip',now)).toBe(true);
 expect(await reservePasswordAttempt(wire,'one.login','another.ip',now)).toBe(false);
 expect(await reservePasswordAttempt(wire,'one.login','one.ip',now+900001)).toBe(true);
 expect(db.sqlite.prepare('SELECT count(*) AS total FROM account_password_attempts WHERE expires_at<=?').get(now+900001)?.total).toBe(0);
 const next=database();for(let n=0;n<30;n++)expect(await reservePasswordAttempt(next.wire,'user.'+n,'shared.ip',now)).toBe(true);
 expect(await reservePasswordAttempt(next.wire,'last.user','shared.ip',now)).toBe(false);
 const denied=await handleAccountApi(request('sign-in','POST',undefined,{'x-real-ip':'shared.ip'}),next.wire);
 expect(denied!.status).toBe(429);expect(denied!.headers.get('retry-after')).toBe('900');
});

test('the attempt table has a bounded size and the API rejects malformed and cross-site input',async()=>{
 const {db,wire}=database();
 db.sqlite.exec("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<10000) INSERT INTO account_password_attempts SELECT 'fixture:'||x,1,"+(Date.now()+900000)+" FROM n;");
 expect(await reservePasswordAttempt(wire,'fixture.login','fixture.ip')).toBe(false);
 const empty=database();
 for(const req of [request('missing'),request('sign-in','GET')])expect((await handleAccountApi(req,empty.wire))!.status).toBe(405);
 for(const body of [{login:'fixture.login',password:null},{login:'fixture.login',password:'x'.repeat(129)},{login:null,password}])expect((await handleAccountApi(request('sign-in','POST',body),empty.wire))!.status).toBe(400);
 expect((await handleAccountApi(request('sign-in','POST',undefined,{'sec-fetch-site':'cross-site'}),empty.wire))!.status).toBe(403);
 const raw=new Request('https://granttap.com/api/account/password/sign-in',{method:'POST',headers:{'content-type':'text/plain'},body:'invalid'});
 expect((await handleAccountApi(raw,empty.wire))!.status).toBe(400);
});

test('stale credential writes cannot overwrite newer credentials or revoke their sessions',async()=>{
 const {db,wire}=database();const store=new AccountPasswords(wire);
 const oldHash=await hashPassword(password);const id=await store.create('fixture.owner',oldHash);expect(id).toBeTruthy();
 const freshHash=await hashPassword(password+' changed');
 expect(await store.set(id!,'fixture.owner',freshHash,oldHash)).toBe('saved');
 await db.prepare('INSERT INTO sessions(token_hash,account_id,expires_at) VALUES(?,?,?)').bind('fixture-session',id!,Date.now()+900000).run();
 expect(await store.set(id!,'stale.login',oldHash,oldHash)).toBe('stale');
 expect(await store.set(id!,'stale.login',oldHash,null)).toBe('stale');
 expect((await store.byAccount(id!))!.password_hash).toBe(freshHash);
 expect(db.sqlite.prepare('SELECT count(*) AS total FROM sessions').get()?.total).toBe(1);
});
