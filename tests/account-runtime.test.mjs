import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {cpSync,mkdirSync,mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';
import {WebSocket} from 'ws';
import test from 'node:test';

async function freePort(){const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;await new Promise(resolve=>server.close(resolve));return port;}

test('isolated production account bundle persists password access and can connect reviewer and own computers',async t=>{
 const root=mkdtempSync(join(tmpdir(),'granttap-account-runtime-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(join(root,'hetzner'));
 cpSync('.runtime/account/hetzner/server.mjs',join(root,'hetzner/server.mjs'));
 cpSync('hetzner/public',join(root,'hetzner/public'),{recursive:true});
 cpSync('migrations',join(root,'migrations'),{recursive:true});
 writeFileSync(join(root,'package.json'),'{"type":"module"}');
 const port=await freePort();const base=`http://127.0.0.1:${port}`;let child;let diagnostics='';
 async function start(){
  child=spawn(process.execPath,[join(root,'hetzner/server.mjs')],{cwd:root,env:{PATH:process.env.PATH,PORT:String(port),HOST:'127.0.0.1',GRANTTAP_ACCOUNT_DB:join(root,'accounts.sqlite'),GRANTTAP_CONNECT_STORE:join(root,'connect.json')},stdio:'pipe'});
  child.stderr.on('data',data=>diagnostics+=String(data));
  for(let i=0;i<60;i++){
   try{if((await fetch(base+'/healthz')).ok)return;}catch{}
   if(child.exitCode!==null)break;await delay(100);
  }throw Error('Isolated account bundle did not start: '+diagnostics);
 }
 async function stop(){if(child?.exitCode!==null)return;const exited=new Promise(resolve=>child.once('exit',resolve));child.kill('SIGTERM');await exited;}
 t.after(stop);await start();
 const call=(path,method='GET',body,token,headers={})=>fetch(base+'/api/account/'+path,{method,headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const password='A unique fixture passphrase for the bundle';
 const registration=await call('password/register','POST',{login:'bundle.fixture',password});assert.equal(registration.status,201);
 const account=await registration.json();assert.match(account.token,/^[A-Za-z0-9_-]{43}$/);
 const machine=await call('machines','POST',{name:'Reviewer sandbox'},account.token);assert.equal(machine.status,201);const reviewer=await machine.json();
 const own=await call('machines','POST',{name:'My own computer'},account.token);assert.equal(own.status,201);const personal=await own.json();assert.notEqual(personal.id,reviewer.id);
 const listed=await call('machines','GET',undefined,account.token);assert.deepEqual((await listed.json()).machines.map(row=>row.name).sort(),['My own computer','Reviewer sandbox']);
 const identity=await call('machine/identity','GET',undefined,reviewer.machineToken);assert.deepEqual(await identity.json(),{accountId:account.accountId,machineId:reviewer.id});
 const opened=await call(`machines/${reviewer.id}/requests`,'POST',{phonePublicKey:Buffer.alloc(32,7).toString('base64url')},account.token);assert.equal(opened.status,201);const recovery=await opened.json();
 const pending=await call('machine/requests','GET',undefined,reviewer.machineToken);assert.equal((await pending.json()).requests[0].id,recovery.id);
 assert.equal((await call(`requests/${recovery.id}`,'GET',undefined,account.token)).status,202);
 const denied=await call('machines','POST',{name:'Untrusted browser'},account.token,{origin:'https://granttap.com'});assert.equal(denied.status,403);
 const browser=await call('password/sign-in','POST',{login:'bundle.fixture',password},undefined,{origin:'https://granttap.com','sec-fetch-site':'same-origin'});
 assert.equal(browser.status,200);assert.equal((await browser.json()).token,undefined);assert.match(browser.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Strict/);
 await new Promise((resolve,reject)=>{
  const socket=new WebSocket(`ws://127.0.0.1:${port}/api/account/control/socket`,{origin:'https://granttap.com'});
  socket.once('unexpected-response',(_request,response)=>{assert.equal(response.statusCode,401);response.resume();resolve();});
  socket.once('open',()=>{socket.close();reject(Error('Unauthenticated socket was accepted'));});
  socket.once('error',reject);
 });
 await stop();await start();
 const signed=await call('password/sign-in','POST',{login:'BUNDLE.fixture',password});assert.equal(signed.status,200);const fresh=await signed.json();assert.equal(fresh.accountId,account.accountId);
 const retained=await call('machines','GET',undefined,fresh.token);assert.equal((await retained.json()).machines.length,2);
 assert.equal((await call('me','DELETE',undefined,fresh.token)).status,200);
 assert.equal((await call('machine/identity','GET',undefined,reviewer.machineToken)).status,401);
 assert.equal((await call('password/sign-in','POST',{login:'bundle.fixture',password})).status,401);
});
