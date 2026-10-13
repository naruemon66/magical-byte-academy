import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,characters} from '../story.js';
import {templates,materialize} from '../templates.js';
import {evaluate,freshState,advance,loadState,saveState,SAVE_KEY,startEndless,endlessCase,advanceEndless} from '../engine.js';
import {existsSync,statSync,readFileSync} from 'node:fs';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
function finishStory(){let s=freshState();s.started=true;for(const c of cases)for(const step of c.steps)s=advance(s,evaluate(step.example,step).score).state;return s;}
test('V2 has ten distinct portraits, all characters in story, and light cinematic assets',()=>{
 assert.equal(Object.keys(characters).length,10);assert.equal(new Set(Object.values(characters).map(p=>p.portrait)).size,10);
 assert.equal(new Set(cases.map(c=>c.character)).size,10);assert.equal(cases.length,12);
 for(const file of ['cast.webp','chamber.webp']){const path=new URL(`../assets/${file}`,import.meta.url);assert.ok(existsSync(path));assert.ok(statSync(path).size<600_000);}
 const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');assert.ok(!/pixelated|office\.svg|monospace/.test(css));
});
test('all story turns and all 30 templates at every difficulty accept their guided answers',()=>{
 assert.equal(templates.length,30);assert.equal(new Set(templates.map(t=>t.id)).size,30);
 for(const id of Object.keys(characters))assert.equal(templates.filter(t=>t.character===id).length,3);
 const collection=[...cases,...templates.flatMap(t=>[0,1,2].map(d=>materialize(t.id,0,d)))];
 for(const c of collection){assert.ok(characters[c.character]);assert.equal(c.steps.length,5);assert.ok(c.vocabulary.length);c.steps.forEach((s,i)=>{assert.equal(s.phase,i);assert.ok(s.success&&s.lesson&&s.hint);assert.equal(evaluate(s.example,s).pass,true,`${c.id} difficulty ${c.difficulty}, turn ${i}: ${s.example}`);});}
});
test('Luna accepts alternative natural phrasing without exact matching',()=>{
 const responses=['Good morning! What can I do to help you?','Is wireless enabled, and is flight mode off?','Choose Academy Guest to join the network.','Use your browser to test the connection.','You are welcome. Come back if you need support.'];responses.forEach((r,i)=>assert.equal(evaluate(r,cases[0].steps[i]).pass,true,r));
});
test('irrelevant, unsafe, rude, and negated advice fail; safe reporting language succeeds',()=>{
 for(const c of [...cases,...templates.map(t=>materialize(t.id))])for(const s of c.steps){assert.equal(evaluate('I like magical strawberry cake.',s).pass,false);assert.equal(evaluate('You are stupid, please help.',s).pass,false);}
 for(const r of ['Please share your password so I can help you.','Do not click links. Please share your password with me.','Please delete all files to find the document.'])assert.equal(evaluate(r,cases[4].steps[1]).pass,false);
 assert.equal(evaluate('Do not check Wi-Fi or airplane mode.',cases[0].steps[1]).pass,false);
 assert.equal(evaluate('Do not click the link. Report the message to IT.',materialize('phishing-message').steps[2]).pass,true);
 assert.equal(evaluate('hi',cases[0].steps[0]).pass,false);
});
test('politeness changes score and response reaction without blocking useful advice',()=>{
 const a=evaluate('Choose Academy Guest to connect to the network.',cases[0].steps[2]),b=evaluate('Please choose Academy Guest to connect to the network.',cases[0].steps[2]);assert.ok(a.pass&&b.pass);assert.ok(b.score>a.score);assert.equal(a.mood,'thinking');assert.equal(b.mood,'happy');
});
test('story advances five turns per reward, records vocabulary and reaches fourth chapter',()=>{
 let s=freshState();for(let c=0;c<cases.length;c++){for(let t=0;t<5;t++){const before=structuredClone(s),r=advance(s,100);assert.deepEqual(s,before);s=r.state;assert.equal(r.completed,t===4);assert.equal(s.completed.length,t===4?c+1:c);}assert.equal(s.caseIndex,c+1);assert.equal(s.stepIndex,0);}
 assert.equal(s.stars,36);assert.equal(s.xp,2100);assert.equal(s.hearts.luna,2);assert.equal(s.hearts.mix,1);assert.equal(s.hearts.noah,1);assert.equal(s.hearts.serena,2);assert.ok(s.achievements.includes('Academy Guardian'));assert.ok(s.achievements.includes('Chamber of Confidence'));assert.ok(s.vocabulary.length>10);assert.equal(new Set(s.achievements).size,s.achievements.length);assert.throws(()=>advance(s,100));
});
test('V1 saves migrate without resetting progress, scores, draft, relationships or settings',()=>{
 const storage=memory();const old={version:1,caseIndex:9,stepIndex:0,completed:[0,1,2,3,4,5,6,7,8],stars:27,xp:1575,hearts:{luna:2,ivy:2,noah:2,pixel:1},satisfaction:Array(9).fill(100),achievements:['Academy Guardian'],turnScores:[],attempts:0,settings:{motion:false,largeText:true},draft:''};storage.setItem(SAVE_KEY,JSON.stringify(old));let migrated=loadState(storage);assert.equal(migrated.version,2);for(const key of ['caseIndex','completed','stars','xp','hearts','settings'])assert.deepEqual(migrated[key],old[key]);assert.equal(migrated.tutorialDone,true);assert.ok(migrated.vocabulary.length);assert.equal(cases[migrated.caseIndex].character,'noah');
 old.caseIndex=0;old.completed=[];old.stepIndex=2;old.turnScores=[95,85];old.draft='Please connect to Academy-Guest.';storage.setItem(SAVE_KEY,JSON.stringify(old));migrated=loadState(storage);assert.equal(migrated.stepIndex,2);assert.equal(migrated.draft,old.draft);
});
test('Endless cycles cover 30 distinct templates before repeating and never repeat adjacent cases',()=>{
 let s=finishStory();const storySnapshot={stars:s.stars,xp:s.xp,hearts:structuredClone(s.hearts),completed:[...s.completed]};const selected=[];
 for(let i=0;i<65;i++){s=startEndless(s,()=>.42);const c=endlessCase(s);selected.push(c.id);if(i)assert.notEqual(selected[i],selected[i-1]);const same=startEndless(s,()=>.99);assert.deepEqual(same.endless.active,s.endless.active);for(const step of c.steps)s=advanceEndless(s,evaluate(step.example,step).score).state;assert.equal(s.endless.completed,i+1);}
 assert.equal(new Set(selected.slice(0,30)).size,30);assert.equal(new Set(selected.slice(30,60)).size,30);assert.equal(s.endless.seenTemplates.length,30);assert.equal(s.endless.cycles,3);assert.ok(s.endless.totalScore>0);assert.ok(s.achievements.includes('Thirty Ways to Help'));
 for(const key of Object.keys(storySnapshot))assert.deepEqual(s[key],storySnapshot[key]);assert.equal(Object.values(s.endless.friendships).reduce((a,b)=>a+b,0),65);assert.throws(()=>startEndless(freshState()));
});
test('context, vocabulary and advanced communication goals vary deterministically',()=>{
 const a=materialize('research-backup',0,0),b=materialize('research-backup',1,2),standard=materialize('research-backup',0,1);assert.equal(evaluate(a.steps[2].example,standard.steps[2]).pass,false);assert.equal(evaluate(standard.steps[2].example,standard.steps[2]).pass,true);assert.notEqual(a.context,b.context);assert.notEqual(a.difficulty,b.difficulty);assert.match(b.steps[2].goal,/so that/);assert.equal(evaluate(a.steps[2].example,b.steps[2]).pass,false);assert.equal(evaluate(b.steps[2].example,b.steps[2]).pass,true);
});
test('V2 saves restore partial story and endless turns, reject corrupt cursors, handle unavailable storage',()=>{
 const storage=memory();let s=advance(freshState(),90).state;s.draft='Could you check Wi-Fi?';assert.ok(saveState(storage,s));assert.deepEqual(loadState(storage),s);
 s=startEndless(finishStory(),()=>.2);s=advanceEndless(s,90).state;s.endless.active.draft='A typed response';saveState(storage,s);assert.deepEqual(loadState(storage),s);
 for(const value of ['not json',JSON.stringify({...s,stepIndex:99}),JSON.stringify({...s,completed:[8]}),JSON.stringify({...s,hearts:null}),JSON.stringify({...s,endless:{...s.endless,bag:['unknown']}}),JSON.stringify({...s,endless:{...s.endless,active:{...s.endless.active,templateId:'missing'}}})]){storage.setItem(SAVE_KEY,value);assert.equal(loadState(storage),null);}
 assert.equal(saveState({setItem(){throw Error();}},s),false);assert.equal(loadState({getItem(){throw Error();}}),null);
});
