import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { browserSession, delay } from './browser-session.mjs';
const base=process.argv[2]||'http://127.0.0.1:3218';
const output=process.argv[3]||'/tmp/granttap-seo-theme-proof/browser';
await mkdir(output,{recursive:true});
const browser=await browserSession();const proof={base,checks:[],behavior:[]};
try {
  const tab=await browser.tab();
  await tab.navigate(base);
  const choose=mode=>tab.evaluate(`(()=>{const select=document.querySelector('.site-theme-picker select');select.value=${JSON.stringify(mode)};select.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
  const inspect=()=>tab.evaluate(`({mode:document.documentElement.dataset.themeMode,theme:document.documentElement.dataset.theme,selected:document.querySelector('.site-theme-picker select')?.value,background:getComputedStyle(document.body).backgroundColor,width:innerWidth,scroll:document.documentElement.scrollWidth,lang:document.documentElement.lang,heading:document.querySelector('h1')?.textContent})`);
  const system=light=>tab.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:light?'light':'dark'}]});
  const capture=async name=>{const{data}=await tab.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(output,name+'.png'),Buffer.from(data,'base64'));};
  for(const [width,height,mobile] of [[320,780,true],[390,844,true],[768,1024,true],[1440,1000,false]]) {
    await tab.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    for(const mode of ['light','dark','auto']) {
      await system(mode==='auto');await choose(mode);await delay(100);
      for(const route of ['/?lang=ru','/blog?lang=ru','/guide','/guide/device-management','/support?lang=ru','/pricing?lang=ru','/mac?lang=ru','/agents/claude-code','/privacy?lang=ru']) {
        await tab.navigate(base+route);await delay(700);const state=await inspect();
        assert.equal(state.theme,mode==='auto'?'light':mode,JSON.stringify({route,...state}));
        assert.equal(state.selected,mode);assert.ok(state.scroll<=state.width,JSON.stringify({route,...state}));
        if(route.includes('lang=ru')||route.startsWith('/guide'))assert.equal(state.lang,'ru',route);
        proof.checks.push({route,width,mode,...state});
        if([390,1440].includes(width)&&['light','dark'].includes(mode)&&['/?lang=ru','/blog?lang=ru','/guide'].includes(route)) await capture(`${width}-${mode}-${route.startsWith('/blog')?'blog':route.startsWith('/guide')?'guide':'home'}`);
      }
    }
  }
  await choose('auto');await system(false);await delay(100);assert.equal((await inspect()).theme,'dark');
  await system(true);await delay(100);assert.equal((await inspect()).theme,'light');proof.behavior.push('Auto follows a live system preference change');
  await choose('dark');await system(true);assert.equal((await inspect()).theme,'dark');proof.behavior.push('Explicit choice overrides system and survives navigation');
  const other=await browser.tab();await other.navigate(base+'/blog');
  await other.evaluate(`localStorage.setItem('granttap.theme','light')`);await delay(100);assert.equal((await inspect()).theme,'light');proof.behavior.push('A second tab synchronizes the existing tab');
  await tab.send('Page.reload');await delay(500);assert.equal((await inspect()).theme,'light');proof.behavior.push('Choice survives reload');
  assert.deepEqual(tab.errors,[]);assert.deepEqual(other.errors,[]);
  await writeFile(path.join(output,'proof.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify({checks:proof.checks.length,behavior:proof.behavior,output}));
} finally {await browser.close();}
