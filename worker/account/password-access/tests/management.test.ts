// @vitest-environment node
import {expect,test} from 'vitest';
import type {D1Database} from '@cloudflare/workers-types';
import {SqliteD1} from '../../../../tests/coverage/account-sqlite';
import {handleAccountApi} from '../../api';
import {AccountAuth} from '../../auth';
import {D1AccountStore} from '../../d1-store';
const password='A fixture passphrase for testing 2026';
const replacement='A different fixture passphrase for testing';
function request(path:string,method:string,body?:unknown,token?:string){return new Request('https://granttap.com/api/account/'+path,{method,headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});}
async function fixture(){
 const db=new SqliteD1();const database=db as unknown as D1Database;
 const call=async(req:Request)=>(await handleAccountApi(req,database))!;
 const r=await call(request('password/register','POST',{login:'owner.fixture',password}));expect(r.status).toBe(201);
 const user=await r.json();return {db,database,call,user,auth:new AccountAuth(new D1AccountStore(database))};
}

test('password replacement preserves the account, revokes old sessions and rejects the old secret',async()=>{
 const f=await fixture();const path='password/credential';
 expect((await f.call(request(path,'GET',undefined,f.user.token))).status).toBe(200);
 const bad=await f.call(request(path,'POST',{login:'renamed.fixture',password:replacement,currentPassword:'wrong'},f.user.token));expect(bad.status).toBe(401);
 expect(await f.auth.accountForToken(f.user.token)).toBe(f.user.accountId);
 const response=await f.call(request(path,'POST',{login:'renamed.fixture',password:replacement,currentPassword:password},f.user.token));expect(response.status).toBe(200);
 const fresh=await response.json();expect(fresh.accountId).toBe(f.user.accountId);expect(await f.auth.accountForToken(f.user.token)).toBeNull();
 expect(await f.auth.accountForToken(fresh.token)).toBe(fresh.accountId);
 expect((await f.call(request('password/sign-in','POST',{login:'renamed.fixture',password}))).status).toBe(401);
 expect((await f.call(request('password/sign-in','POST',{login:'renamed.fixture',password:replacement}))).status).toBe(200);
});

test('an authenticated existing account can add credentials without creating another account',async()=>{
 const f=await fixture();const account='00000000-0000-4000-8000-000000000002';
 await f.db.prepare('INSERT INTO accounts(id,created_at) VALUES(?,?)').bind(account,Date.now()).run();
 const session=await f.auth.createSession(account);
 const read=await f.call(request('password/credential','GET',undefined,session.token));expect(await read.json()).toEqual({login:null});
 const saved=await f.call(request('password/credential','POST',{login:'existing.fixture',password},session.token));expect(saved.status).toBe(200);
 expect((await saved.json()).accountId).toBe(account);
 expect(f.db.sqlite.prepare('SELECT count(*) AS total FROM accounts').get()?.total).toBe(2);
});

test('a delegated sign-in token cannot add or replace account credentials',async()=>{
 const f=await fixture();
 const issued=await f.call(request('login-tokens','POST',{name:'Fixture',expiresInSeconds:900,maxUses:1},f.user.token));
 const token=await issued.json();expect(issued.status).toBe(201);
 const exchanged=await f.call(request('login-tokens/redeem','POST',{secret:token.secret}));const delegated=await exchanged.json();
 expect(exchanged.status).toBe(200);
 for(const method of ['GET','POST'])expect((await f.call(request('password/credential',method,method==='POST'?{login:'other.fixture',password}:undefined,delegated.token))).status).toBe(403);
 expect((await f.call(request('password/credential','GET'))).status).toBe(401);
});

test('a duplicate login or failed transaction preserves credentials and sessions',async()=>{
 const f=await fixture();await f.call(request('password/register','POST',{login:'taken.fixture',password}));
 const result=await f.call(request('password/credential','POST',{login:'taken.fixture',password:replacement,currentPassword:password},f.user.token));expect(result.status).toBe(409);
 expect(await f.auth.accountForToken(f.user.token)).toBe(f.user.accountId);
 expect(f.db.sqlite.prepare('SELECT login FROM account_password_credentials WHERE account_id=?').get(f.user.accountId)?.login).toBe('owner.fixture');
 f.db.sqlite.exec("CREATE TRIGGER reject_session_delete BEFORE DELETE ON sessions BEGIN SELECT RAISE(ABORT,'fixture transaction failure'); END;");
 const failed=await f.call(request('password/credential','POST',{login:'changed.fixture',password:replacement,currentPassword:password},f.user.token));expect(failed.status).toBe(503);
 expect(await f.auth.accountForToken(f.user.token)).toBe(f.user.accountId);
 expect(f.db.sqlite.prepare('SELECT login FROM account_password_credentials WHERE account_id=?').get(f.user.accountId)?.login).toBe('owner.fixture');
});

test('deleting the ordinary account removes password credentials and sessions',async()=>{
 const f=await fixture();expect((await f.call(request('me','DELETE',undefined,f.user.token))).status).toBe(200);
 expect(f.db.sqlite.prepare('SELECT count(*) AS total FROM account_password_credentials').get()?.total).toBe(0);
 expect(await f.auth.accountForToken(f.user.token)).toBeNull();
 expect((await f.call(request('password/sign-in','POST',{login:'owner.fixture',password}))).status).toBe(401);
});
