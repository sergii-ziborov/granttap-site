import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import WebSocket from 'ws';

// Tests only the public guide. No pairing, provider login or real automations.
const base = process.argv[2] || 'http://127.0.0.1:3215';
const output = process.argv[3] || '/tmp/granttap-guide-browser';
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
      if (await evaluate('document.readyState === "complete" && !!document.querySelector(".guide-app h1")')) break;
      await sleep(100);
    }
    await evaluate('document.fonts.ready.then(() => true)'); await sleep(800);
    assert.equal(await evaluate('!!document.querySelector(".guide-app h1")'), true, route);
  }
  async function capture(name) {
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(output, name + '.png'), Buffer.from(data, 'base64'));
  }
  async function layout(name) {
    const state = await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector("h1").textContent,theme:document.documentElement.dataset.theme,heroImages:[...document.querySelectorAll(".guide-hero-screens img")].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.getAttribute("src")}))})');
    assert.ok(state.scroll <= state.width, `${name}: horizontal overflow ${state.scroll}/${state.width}`);
    assert.ok(state.heroImages.every(image => image.loaded), `${name}: missing hero image`);
    proof.checks.push({ name, ...state });
  }
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await ready('/guide'); await layout('desktop home'); await capture('desktop-home');
  await evaluate('document.querySelector(".guide-search-trigger").click()'); await sleep(200);
  await send('Input.insertText', { text: 'авторизация' });
  let matches = [];
  // The search index is loaded on demand; public-network latency can exceed
  // the interaction delay used by the local production check.
  for (let i = 0; i < 100; i++) {
    matches = await evaluate('[...document.querySelectorAll(".guide-search-results a")].map(a=>a.getAttribute("href"))');
    if (matches.some(href => href.includes('provider-sign-in'))) break;
    await sleep(100);
  }
  assert.ok(matches.some(href => href.includes('provider-sign-in')), 'search finds sign-in'); proof.checks.push({ name: 'full text search', matches }); await capture('desktop-search');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(100); assert.equal(await evaluate('document.querySelectorAll("dialog[open]").length'), 0);
  await evaluate('document.querySelector(".gallery-filters button:nth-child(3)").click()');
  await evaluate('document.querySelector("#guide-screens").scrollIntoView()'); await sleep(500);
  const count = await evaluate('document.querySelector(".gallery-count").textContent'); assert.ok(count.includes('Devices'), count);
  await evaluate('document.querySelector(".guide-home-gallery .capture-open").click()'); await sleep(200);
  assert.equal(await evaluate('document.querySelector(".guide-lightbox[open] img").complete'), true); await capture('desktop-screenshot');
  await evaluate('document.querySelector(".lightbox-toolbar button").click()');
  assert.equal(await evaluate('document.activeElement.className'), 'capture-open');
  await ready('/guide/device-management'); await layout('desktop chapter'); await capture('desktop-chapter');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await ready('/guide'); await layout('mobile home'); await capture('mobile-home');
  await evaluate('document.querySelector(".guide-menu-button").click()'); await sleep(150);
  assert.equal(await evaluate('document.querySelector("#guide-sidebar").getAttribute("aria-modal")'), 'true');
  assert.equal(await evaluate('document.body.style.overflow'), 'hidden'); await capture('mobile-navigation');
  await evaluate('document.querySelector(".guide-drawer-close").click()'); assert.equal(await evaluate('document.body.style.overflow'), '');
  await ready('/guide/provider-sign-in'); await layout('mobile sign-in chapter'); await capture('mobile-chapter');
  await evaluate('document.querySelector(".guide-capture").scrollIntoView()'); await sleep(400); await capture('mobile-inline-screen');
  await evaluate('document.querySelector(".capture-open").click()'); await sleep(150); await capture('mobile-screenshot');
  await evaluate('document.querySelector(".lightbox-toolbar button").click()');
  await evaluate('(() => { const select = document.querySelector(".site-theme-picker select"); select.value = "light"; select.dispatchEvent(new Event("change", { bubbles: true })); })()');
  assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light'); await layout('mobile light theme'); await capture('mobile-light');
  assert.deepEqual(proof.errors, [], 'no browser exceptions');
  await writeFile(path.join(output, 'proof.json'), JSON.stringify(proof, null, 2));
  console.log(JSON.stringify({ checks: proof.checks.map(x=>x.name), errors: proof.errors, output }));
} finally {
  socket?.close(); chrome.kill('SIGTERM'); await sleep(500); await rm(profile, { recursive: true, force: true });
}
