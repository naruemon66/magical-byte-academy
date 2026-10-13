const {chromium}=require('playwright');
const assert=require('node:assert/strict');
require('node:fs').mkdirSync('test-results',{recursive:true});
(async()=>{
const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.GAME_TEST_URL||'http://127.0.0.1:8000');await page.getByText('Start a new story').click();await page.getByText('Welcome your visitor').click();
await page.screenshot({path:'test-results/desktop.png',fullPage:true});
await page.locator('#answer').fill('I enjoy strawberry cake.');await page.locator('#submit').click();assert.equal(await page.locator('#next').count(),0);await page.locator('#fallback').click();await page.locator('#learning .guide button').first().click();await page.locator('#clear').click();
const cases=await import('../cases.js');
for(let c=0;c<9;c++){
 for(let t=0;t<5;t++){
  await page.locator('#answer').fill(cases.cases[c].steps[t].example);await page.locator('#submit').click();await page.locator('#next').click();
  if(c===0&&t===1){await page.reload();await page.locator('#continue').click();assert.match(await page.locator('#goal').textContent(),/Academy-Guest/);}
 }
 assert.match(await page.locator('main').textContent(),/Support ticket resolved/);await page.locator('#next-case').click();if(c<8)await page.locator('#greet').click();
}
assert.match(await page.locator('main').textContent(),/All nine cases completed/);
let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));assert.equal(saved.completed.length,9);assert.ok(saved.stars>0);assert.ok(saved.achievements.includes('Academy Guardian'));
await page.locator('#ending-journal').click();await page.locator('[data-replay="0"]').click();await page.locator('#greet').click();for(let t=0;t<5;t++){await page.locator('#answer').fill(cases.cases[0].steps[t].example);await page.locator('#submit').click();await page.locator('#next').click();}const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));assert.deepEqual(after,saved);await page.locator('#next-case').click();
await page.setViewportSize({width:390,height:844});await page.locator('#ending-home').click();await page.screenshot({path:'test-results/mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
// A separate save exercises every dialog and microphone paths without real audio.
const context=await browser.newContext({viewport:{width:390,height:844}});
const speech=await context.newPage();speech.on('pageerror',e=>errors.push(e.message));
await speech.addInitScript(()=>{
 class MockRecognition {
  start(){this.onstart?.();window.activeRecognition=this;}
  stop(){this.onend?.();}
  abort(){this.onend?.();}
 }
 window.SpeechRecognition=MockRecognition;
});
await speech.goto(process.env.GAME_TEST_URL||'http://127.0.0.1:8000');
for(const action of ['help','credits','journal']){await speech.locator(`[data-action="${action}"]`).click();assert.ok(await speech.locator('#modal').isVisible());await speech.locator('#close-modal').click();}
await speech.locator('[data-action="settings"]').click();await speech.locator('#motion').uncheck();await speech.locator('#large').check();assert.ok(await speech.locator('body').evaluate(e=>e.classList.contains('reduce-motion')));await speech.locator('#close-modal').click();
await speech.locator('#new-game').click();if(await speech.locator('#confirm-new').count())await speech.locator('#confirm-new').click();await speech.locator('#greet').click();assert.ok(await speech.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await speech.screenshot({path:'test-results/mobile-game.png',fullPage:true});
await speech.locator('#hint').click();assert.match(await speech.locator('#learning').textContent(),/Pixel’s gentle hint/);
await speech.locator('#speak-mode').click();await speech.locator('#record').click();
await speech.evaluate(()=>window.activeRecognition.onresult({results:[[{transcript:'Hello! How can I help you today?'}]]}));
await speech.locator('#submit').click();assert.equal(await speech.locator('#next').count(),0);
await speech.locator('#record').click();await speech.locator('#submit').click();assert.equal(await speech.locator('#next').count(),0);
await speech.locator('#confirm-transcript').click();await speech.locator('#submit').click();await speech.locator('#next').click();
await speech.locator('#record').click();await speech.evaluate(()=>window.activeRecognition.onerror({error:'not-allowed'}));assert.match(await speech.locator('#speech-status').textContent(),/denied/);
await speech.locator('#type-mode').click();await speech.locator('#answer').fill(cases.cases[0].steps[1].example);await speech.locator('#submit').click();await speech.locator('#next').click();
await speech.locator('#speak-mode').click();await speech.evaluate(()=>{delete window.SpeechRecognition;delete window.webkitSpeechRecognition;});await speech.locator('#record').click();assert.match(await speech.locator('#speech-status').textContent(),/does not support/);
await speech.locator('#type-mode').click();await speech.locator('#home').click();await speech.locator('#new-game').click();assert.ok(await speech.locator('#confirm-new').isVisible());await speech.locator('#close-modal').click();await speech.locator('#continue').click();
await speech.locator('[data-action="settings"]').click();await speech.locator('#reset-save').click();await speech.locator('#do-reset').click();const reset=await speech.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));assert.equal(reset.caseIndex,0);assert.equal(reset.stars,0);
await context.close();
assert.deepEqual(errors,[]);console.log('PASS: 45 story turns, rejection/retry, reload/resume, all rewards, ending, replay save protection, mobile layout, dialogs, settings, reset, microphone confirmation/error/fallback; no browser errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
