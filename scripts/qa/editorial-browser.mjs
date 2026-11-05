import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import WebSocket from 'ws';

// Inspect published editorial pages only. No pairing, login or real automation changes.
const base = process.argv[2] || 'http://127.0.0.1:3215';
const output = process.argv[3] || '/tmp/granttap-editorial-browser';
await mkdir(output, { recursive: true });
const profile = await mkdtemp(path.join(tmpdir(), 'granttap-guide-chrome-'));
const chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`], { stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
const proof = { base, checks: [], errors: [] };
try {
  let port;
  for (let i = 0; i < 80; i++) {
    try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await sleep(100); }
  }
  assert.ok(port, 'Chrome debug endpoint');
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
  let id = 0; const pending = new Map();
  socket.on('message', bytes => {
    const message = JSON.parse(bytes);
    if (message.id) { const call = pending.get(message.id); pending.delete(message.id); if (message.error) call?.reject(message.error); else call?.resolve(message.result); }
    if (message.method === 'Runtime.exceptionThrown') proof.errors.push(message.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails)); return result.result.value;
  };
  async function ready(route) {
    await send('Page.navigate', { url: base + route });
    for (let i = 0; i < 120; i++) {
      if (await evaluate('document.readyState === "complete" && !!document.querySelector(".blog-article h1")')) break;
      await sleep(100);
    }
    await evaluate('document.fonts.ready.then(() => true)'); await sleep(800);
    assert.equal(await evaluate('!!document.querySelector(".blog-article h1")'), true, route);
  }
  async function capture(name) {
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, name + '.png'), Buffer.from(data, 'base64'));
  }
  await send('Page.enable'); await send('Runtime.enable');
  const cases = [
    ['/blog/granttap-evaluate-coding-agent-own-task?lang=ru','evaluation'],
    ['/blog/granttap-untrusted-content-agent-tool-boundaries?lang=ru','injection'],
    ['/blog/granttap-review-agent-diffs-from-phone?lang=ru','review'],
    ['/blog/granttap-agent-processes-cpu-memory-disk?lang=ru','resources'],
    ['/blog/granttap-share-agent-project-colleague-access?lang=ru','team'],
  ];
  for (const [width,height,mobile] of [[1440,1000,false],[390,844,true]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    for(const [route,name] of cases){
      await ready(route);
      const state=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,title:document.querySelector("h1").textContent,images:[...document.querySelectorAll(".blog-article img")].map(i=>i.getAttribute("src")),note:document.querySelector(".blog-current-guide").textContent})');
      assert.ok(state.scroll<=state.width,JSON.stringify(state));assert.ok(state.images.filter(x=>x.includes("october2026-backfill")).length>=3);assert.ok(state.note.includes('2026-11-05'));
      await capture((mobile?'mobile-':'desktop-')+name);
      await evaluate('document.documentElement.style.scrollBehavior="auto"; window.scrollTo(0,document.querySelector(".blog-current-guide").getBoundingClientRect().top+scrollY)');await sleep(400);
      state.readingScrollY=await evaluate('scrollY');
      assert.ok(state.readingScrollY>0,'article scrolls to reading text');
      assert.ok(await evaluate('document.querySelector(".blog-current-guide").getBoundingClientRect().height>0'),'review notice remains visible on mobile');
      if(name==='review')await capture((mobile?'mobile-':'desktop-')+name+'-reading');
      proof.checks.push({name:(mobile?'mobile ':'desktop ')+name,...state});
    }
  }
  assert.deepEqual(proof.errors,[]);
  await writeFile(path.join(output,'proof.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify({checks:proof.checks.length,errors:proof.errors,output}));
} finally {socket?.close();chrome.kill('SIGTERM');await sleep(500);await rm(profile,{recursive:true,force:true});}
