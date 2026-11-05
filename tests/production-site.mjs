import assert from 'node:assert/strict';
import {after} from 'node:test';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';
import {request as httpRequest} from 'node:http';
export async function productionSite() {
 const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));
 const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
 const child=spawn(process.execPath,['.runtime/site-start.mjs'],{env:{...process.env,PORT:String(port),HOST:'127.0.0.1'},stdio:'pipe'});
 let errors='';child.stderr.on('data',data=>{errors+=data.toString();});child.stdout.resume();
 after(async()=>{if(child.exitCode!==null)return;const exit=new Promise(resolve=>child.once('exit',resolve));child.kill('SIGTERM');await exit;});
 let ready=false;
 for(let n=0;n<100;n++){try{ready=(await fetch(`http://127.0.0.1:${port}/`)).ok;}catch{}if(ready||child.exitCode!==null)break;await delay(100);}
 assert.ok(ready,errors||'Production server failed to start');
 return (url,extraHeaders={})=>new Promise((resolve,reject)=>{
  const target=new URL(url);
  const operation=httpRequest(`http://127.0.0.1:${port}${target.pathname}${target.search}`,{headers:{host:target.host,'x-forwarded-proto':target.protocol.slice(0,-1),accept:'text/html',...extraHeaders}},response=>{
    const chunks=[];response.on('data',chunk=>chunks.push(chunk));response.on('error',reject);
    response.on('end',()=>resolve(new Response(Buffer.concat(chunks),{status:response.statusCode,headers:response.headers})));
  });
  operation.on('error',reject);operation.end();
 });
}
