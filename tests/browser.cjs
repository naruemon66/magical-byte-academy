const {chromium}=require('playwright');
const assert=require('node:assert/strict');
require('node:fs').mkdirSync('test-results',{recursive:true});
const url=process.env.GAME_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const {cases}=await import('../story.js');
 const {materialize}=await import('../templates.js');
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']});
 const errors=[];
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  async function boot(p){await p.goto(url);await p.locator('#loading').waitFor({state:'hidden'});}
  async function turn(p,example){await p.locator('#answer').fill(example);await p.locator('#submit').click();await p.locator('#next').click();}
  await boot(page);
  assert.equal(await page.locator('main button').count(),4);
  assert.equal(await page.locator('#toolbar').isVisible(),false);
  await page.screenshot({path:'test-results/v2-title.png',fullPage:true});
  await page.locator('#new-game').click();await page.locator('#intro-next').click();await page.locator('#intro-next').click();await page.locator('#greet').click();
  await page.screenshot({path:'test-results/v2-game.png',fullPage:true});
  await page.locator('#answer').fill('I enjoy strawberry cake.');await page.locator('#submit').click();assert.equal(await page.locator('#next').count(),0);
  await page.locator('#fallback').click();await page.locator('#learning .guide button').first().click();await page.locator('#clear').click();
  for(let c=0;c<cases.length;c++){
   for(let t=0;t<5;t++){
    await turn(page,cases[c].steps[t].example);
    if(c===0&&t===1){await page.reload();await page.locator('#loading').waitFor({state:'hidden'});await page.locator('#continue').click();assert.match(await page.locator('#goal').textContent(),/Academy-Guest/);}
   }
   assert.match(await page.locator('main').textContent(),/Support ticket resolved/);
   await page.locator('#next-case').click();if(c<cases.length-1)await page.locator('#greet').click();
  }
  assert.match(await page.locator('main').textContent(),/All 12 story cases completed/);
  const storySave=await page.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));
  assert.equal(storySave.completed.length,12);assert.ok(storySave.achievements.includes('Chamber of Confidence'));
  await page.locator('#ending-journal').click();await page.getByText('Story tickets · practice completed cases',{exact:true}).click();await page.locator('[data-replay="0"]').click();await page.locator('#greet').click();
  for(const step of cases[0].steps)await turn(page,step.example);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1'))),storySave);
  await page.locator('#next-case').click();await page.locator('#endless-start').click();
  const sequence=[];
  for(let i=0;i<31;i++){
   let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));
   const a=saved.endless.active,c=materialize(a.templateId,a.variant,a.difficulty);sequence.push(c.id);
   await page.locator('#greet').click();
   for(let t=0;t<5;t++){
    await turn(page,c.steps[t].example);
    if(i===0&&t===1){await page.reload();await page.locator('#loading').waitFor({state:'hidden'});await page.locator('#continue').click();await page.locator('#greet').click();assert.equal(await page.locator('#goal').textContent(),c.steps[2].goal);}
   }
   assert.match(await page.locator('main').textContent(),/Endless request resolved/);
   saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));
   assert.equal(saved.endless.completed,i+1);assert.equal(saved.stars,storySave.stars);assert.equal(saved.xp,storySave.xp);assert.deepEqual(saved.hearts,storySave.hearts);
   if(i<30)await page.locator('#next-case').click();
  }
  assert.equal(new Set(sequence.slice(0,30)).size,30);sequence.slice(1).forEach((id,i)=>assert.notEqual(id,sequence[i]));
  // Opening practice from a completed Endless reward must return safely with no active request.
  await page.locator('[data-action="journal"]').click();await page.getByText('Story tickets · practice completed cases',{exact:true}).click();await page.locator('[data-replay="0"]').click();await page.locator('#greet').click();for(const step of cases[0].steps)await turn(page,step.example);await page.locator('#next-case').click();assert.ok(await page.locator('#endless-start').isVisible());
  await page.locator('#endless-start').click();assert.match(await page.locator('.returning').textContent(),/advice|previous|last|remember|visit|guidance|session|recommendation/i);
  await page.locator('[data-action="home"]').click();await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/v2-mobile-title.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));

  // Microphone paths use a simulated browser provider, never actual recorded audio.
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const speech=await context.newPage();speech.on('pageerror',e=>errors.push(e.message));
  await speech.addInitScript(()=>{class MockRecognition{start(){this.onstart?.();window.activeRecognition=this;}stop(){this.onend?.();}abort(){this.onend?.();}}window.SpeechRecognition=MockRecognition;});
  await boot(speech);
  await speech.locator('[data-title-action="help"]').click();assert.match(await speech.locator('#modal-content').textContent(),/How to Play/);await speech.locator('#close-modal').click();
  await speech.locator('[data-title-action="settings"]').click();await speech.locator('#motion').uncheck();await speech.locator('#large').check();assert.ok(await speech.locator('body').evaluate(e=>e.classList.contains('reduce-motion')));await speech.locator('#close-modal').click();
  await speech.locator('#new-game').click();await speech.locator('#intro-next').click();await speech.locator('#intro-next').click();await speech.locator('#greet').click();assert.ok(await speech.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await speech.screenshot({path:'test-results/v2-mobile-game.png',fullPage:true});
  await speech.locator('#hint').click();assert.match(await speech.locator('#learning').textContent(),/Chamber Guide/);
  await speech.locator('#speak-mode').click();await speech.locator('#record').click();await speech.evaluate(()=>window.activeRecognition.onresult({results:[[{transcript:'Hello! How can I help you today?'}]]}));
  await speech.locator('#submit').click();assert.equal(await speech.locator('#next').count(),0);await speech.locator('#record').click();await speech.locator('#submit').click();assert.equal(await speech.locator('#next').count(),0);
  await speech.locator('#confirm-transcript').click();await speech.locator('#submit').click();await speech.locator('#next').click();
  await speech.locator('#record').click();await speech.evaluate(()=>window.activeRecognition.onerror({error:'not-allowed'}));assert.match(await speech.locator('#speech-status').textContent(),/denied/);
  await speech.locator('#type-mode').click();await speech.locator('#answer').fill(cases[0].steps[1].example);await speech.locator('#answer').press('Control+Enter');await speech.locator('#next').click();
  await speech.locator('#speak-mode').click();await speech.evaluate(()=>{delete window.SpeechRecognition;delete window.webkitSpeechRecognition;});await speech.locator('#record').click();assert.match(await speech.locator('#speech-status').textContent(),/does not support/);await speech.locator('#type-mode').click();
  await speech.locator('[data-action="home"]').click();await speech.locator('#new-game').click();assert.ok(await speech.locator('#confirm-new').isVisible());await speech.locator('#close-modal').click();await speech.locator('#continue').click();
  await speech.locator('[data-action="settings"]').click();await speech.locator('#reset-save').click();await speech.locator('#do-reset').click();const reset=await speech.evaluate(()=>JSON.parse(localStorage.getItem('magical-byte-academy-v1')));assert.equal(reset.started,false);assert.equal(reset.endless.completed,0);
  await context.close();

  // A real V1-format save migrates in the browser and resumes the original turn.
  const legacy=await browser.newPage();legacy.on('pageerror',e=>errors.push(e.message));
  await legacy.addInitScript(()=>{localStorage.setItem('magical-byte-academy-v1',JSON.stringify({version:1,caseIndex:0,stepIndex:2,completed:[],stars:0,xp:0,hearts:{},satisfaction:[],achievements:[],turnScores:[90,95],attempts:0,settings:{motion:false,largeText:false},draft:'Please select Academy-Guest.'}));});
  await boot(legacy);await legacy.locator('#continue').click();assert.equal(await legacy.locator('#answer').inputValue(),'Please select Academy-Guest.');assert.match(await legacy.locator('#goal').textContent(),/Academy-Guest/);await legacy.close();
  const failedArt=await browser.newPage();failedArt.on('pageerror',e=>errors.push(e.message));await failedArt.route('**/assets/*.webp',route=>route.abort());await boot(failedArt);assert.ok(await failedArt.locator('.asset-warning').isVisible());assert.ok(await failedArt.locator('#new-game').isVisible());await failedArt.close();
  assert.deepEqual(errors,[]);
  console.log('PASS: 12 story cases (60 turns), 31 endless cases (155 turns), 30 unique templates then safe repeat, old-save migration, resume, replay protection, returning dialogue, keyboard, mobile, dialogs/reset, simulated microphone confirmation/errors, image-failure fallback; no browser exceptions.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
