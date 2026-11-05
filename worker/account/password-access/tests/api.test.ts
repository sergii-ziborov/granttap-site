// @vitest-environment node
import {expect,test} from 'vitest';
import type {D1Database} from '@cloudflare/workers-types';
import {SqliteD1} from '../../../../tests/coverage/account-sqlite';
import {handleAccountApi} from '../../api';
import {AccountAuth} from '../../auth';
import {D1AccountStore} from '../../d1-store';
const password='A fixture passphrase for testing 2026';
function request(action:string,body:unknown,token?:string,headers:Record<string,string>={}) {
 return new Request('https://granttap.com/api/account/password/'+action,{method:'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...headers},body:JSON.stringify(body)});
}
function fixture(){const db=new SqliteD1();const database=db as unknown as D1Database;return {db,auth:new AccountAuth(new D1AccountStore(database)),call:async(req:Request)=>(await handleAccountApi(req,database))!};}

test('password registration creates a durable normal account and sign-in preserves its identity',async()=>{
 const f=fixture();const response=await f.call(request('register',{login:'Review.Fixture',password}));
 expect(response.status).toBe(201);const created=await response.json();expect(created.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
 expect(await f.auth.accountForToken(created.token)).toBe(created.accountId);
 expect(await f.auth.canManageCredentials(created.token)).toBe(true);
 const signed=await f.call(request('sign-in',{login:'review.fixture',password}));expect(signed.status).toBe(200);
 const session=await signed.json();expect(session.accountId).toBe(created.accountId);expect(session.token).not.toBe(created.token);
 const stored=f.db.sqlite.prepare('SELECT * FROM account_password_credentials').get();
 expect(JSON.stringify(stored)).not.toContain(password);expect(stored?.login).toBe('review.fixture');
 const second=await f.call(request('register',{login:'other.fixture',password}));expect(second.status).toBe(201);
 const hashes=f.db.sqlite.prepare('SELECT password_hash FROM account_password_credentials').all();
 expect(hashes[0].password_hash).not.toBe(hashes[1].password_hash);
});

test('unknown login and wrong password have the same response and never issue a cookie',async()=>{
 const f=fixture();await f.call(request('register',{login:'review.fixture',password}));
 const unknown=await f.call(request('sign-in',{login:'missing.fixture',password}));
 const wrong=await f.call(request('sign-in',{login:'review.fixture',password:'This is the wrong fixture password'}));
 expect(unknown.status).toBe(401);expect(wrong.status).toBe(401);expect(await wrong.json()).toEqual(await unknown.json());
 expect(wrong.headers.get('set-cookie')).toBeNull();
});

test('browser sign-in uses a protected cookie and does not return its bearer',async()=>{
 const f=fixture();await f.call(request('register',{login:'browser.fixture',password}));
 const response=await f.call(request('sign-in',{login:'browser.fixture',password},undefined,{origin:'https://granttap.com','sec-fetch-site':'same-origin'}));
 expect(response.status).toBe(200);expect(response.headers.get('set-cookie')).toContain('HttpOnly; Secure; SameSite=Strict');
 expect((await response.json()).token).toBeUndefined();
 const cross=await f.call(request('sign-in',{login:'browser.fixture',password},undefined,{origin:'https://untrusted.example'}));expect(cross.status).toBe(403);
});

test('invalid input and a duplicate login do not create an extra account',async()=>{
 const f=fixture();
 for(const body of [{login:'ab',password},{login:'valid.fixture',password:'short'},{login:'bad name',password},{login:'valid.fixture',password:'x'.repeat(129)}])expect((await f.call(request('register',body))).status).toBe(400);
 expect((await f.call(request('register',{login:'valid.fixture',password}))).status).toBe(201);
 expect((await f.call(request('register',{login:'VALID.fixture',password}))).status).toBe(409);
 expect(f.db.sqlite.prepare('SELECT count(*) AS total FROM accounts').get()?.total).toBe(1);
});
