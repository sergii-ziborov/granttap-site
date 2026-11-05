import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import WebSocket from 'ws';
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function browserSession() {
  const profile = await mkdtemp(path.join(tmpdir(), 'granttap-site-qa-'));
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`], {stdio:'ignore'});
  let port;
  for(let i=0;i<100;i++){try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(100);}}
  assert.ok(port,'Chrome debug endpoint');
  const sockets=[];
  async function tab() {
    const target=await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
    const socket=new WebSocket(target.webSocketDebuggerUrl);sockets.push(socket);
    await new Promise((resolve,reject)=>{socket.once('open',resolve);socket.once('error',reject);});
    let id=0;const pending=new Map();const errors=[];
    socket.on('message',bytes=>{const message=JSON.parse(bytes);if(message.id){const call=pending.get(message.id);pending.delete(message.id);if(message.error)call?.reject(message.error);else call?.resolve(message.result);}if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);});
    const send=(method,params={})=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});socket.send(JSON.stringify({id:next,method,params}));});
    const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});assert.ok(!result.exceptionDetails,JSON.stringify(result.exceptionDetails));return result.result.value;};
    await send('Page.enable');await send('Runtime.enable');
    async function navigate(url,selector='h1') {
      await send('Page.navigate',{url});
      let ready=false;
      for(let i=0;i<150;i++){ready=await evaluate(`document.readyState==='complete' && !!document.querySelector(${JSON.stringify(selector)})`);if(ready)break;await delay(100);}
      assert.ok(ready,url);await evaluate('document.fonts.ready.then(()=>true)');await delay(200);
    }
    return {send,evaluate,navigate,errors};
  }
  return {tab,async close(){sockets.forEach(socket=>socket.close());chrome.kill('SIGTERM');await delay(500);await rm(profile,{recursive:true,force:true});}};
}
