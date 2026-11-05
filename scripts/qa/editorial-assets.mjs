import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {browserSession,delay} from './browser-session.mjs';
const base=process.argv[2]||'http://127.0.0.1:3218';
const browser=await browserSession();
const records=[];
try {
 const tab=await browser.tab();
 const icon=(await readFile('public/brand/icon-192.webp')).toString('base64');
 await tab.send('Emulation.setDeviceMetricsOverride',{width:1200,height:630,deviceScaleFactor:1,mobile:false});
 for(const locale of ['en','ru']) {
  const heading=locale==='en'?'Your coding agents.<br>Within reach.':'Ваши coding-агенты.<br>Всегда под рукой.';
  const sub=locale==='en'?'See progress. Make the decision. Continue the Task.':'Следите за работой. Принимайте решения. Продолжайте Task.';
  const html=`<!doctype html><html lang="${locale}"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f6f3ed;color:#242321;font-family:Arial,sans-serif;padding:64px 72px;position:relative;overflow:hidden}.brand{display:flex;align-items:center;gap:16px;font-size:29px;font-weight:700}.brand img{width:58px;height:58px;border-radius:14px}h1{font-size:${locale==='en'?76:65}px;letter-spacing:-3px;line-height:1.07;margin:48px 0 25px;position:relative;z-index:2}p{font-size:25px;line-height:1.5;max-width:850px;position:relative;z-index:2}.bottom{position:absolute;bottom:54px;left:72px;right:72px;display:flex;justify-content:space-between;border-top:1px solid #d8d1c7;padding-top:23px;color:#625e59;font-size:20px}.orb{position:absolute;width:430px;height:430px;right:-185px;top:70px;background:#e66f28;border-radius:50%;opacity:.18}.dot{color:#cb581a}</style><div class="orb"></div><div class="brand"><img src="data:image/webp;base64,${icon}">GrantTap</div><h1>${heading}</h1><p>${sub}</p><div class="bottom"><span>Claude Code <span class="dot">·</span> Codex <span class="dot">·</span> Cursor</span><span>granttap.com</span></div></html>`;
  await tab.send('Page.navigate',{url:'data:text/html;charset=utf-8,'+encodeURIComponent(html)});await delay(250);
  const {data}=await tab.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  const bytes=Buffer.from(data,'base64');const destination=`public/brand/share-${locale}.png`;await writeFile(destination,bytes);
  records.push({destination,width:1200,height:630,kind:'HTML-rendered brand card',sha256:createHash('sha256').update(bytes).digest('hex')});
 }
 await tab.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await tab.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'}]});
 await tab.navigate(base+'/?lang=ru');await delay(800);
 await tab.evaluate(`(()=>{const select=document.querySelector('.site-theme-picker select');select.value='light';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);await delay(300);
 const {data}=await tab.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 const bytes=Buffer.from(data,'base64');const destination='public/blog/seo2026-guides/site-theme-light.png';await writeFile(destination,bytes);
 records.push({destination,url:base+'/?lang=ru',width:390,height:844,kind:'Actual Chromium capture of the November 5 website release candidate, light appearance',sha256:createHash('sha256').update(bytes).digest('hex')});
 await mkdir('docs/editorial/seo2026-guides',{recursive:true});
 await writeFile('docs/editorial/seo2026-guides/browser-assets.json',JSON.stringify({capturedOn:'2026-11-05',records},null,2)+'\n');
 console.log(records.map(({destination,kind})=>({destination,kind})));
} finally {await browser.close();}
