import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,characters} from '../cases.js';
import {evaluate,freshState,advance,loadState,saveState,SAVE_KEY} from '../engine.js';
import {existsSync} from 'node:fs';
test('all nine cases have complete turns, artwork, and accepted guided responses',()=>{
 assert.equal(cases.length,9);
 for(const c of cases){assert.ok(characters[c.character]);assert.equal(c.steps.length,5);for(const mood of ['happy','worried','thinking'])assert.ok(existsSync(new URL(`../assets/${c.character}-${mood}.svg`,import.meta.url)));c.steps.forEach((s,i)=>{assert.equal(s.phase,i);assert.ok(s.success&&s.lesson&&s.hint);assert.equal(evaluate(s.example,s).pass,true,`${c.id} turn ${i}: ${s.example}`);});}
});
test('Luna accepts natural alternative phrasing',()=>{
 const responses=['Good morning! What can I do to help you?','Is wireless enabled, and is flight mode off?','Choose Academy Guest to join the network.','Use your browser to test the connection.','You are welcome. Come back if you need support.'];responses.forEach((r,i)=>assert.equal(evaluate(r,cases[0].steps[i]).pass,true,r));
});
test('irrelevant, unsafe, rude and negated advice cannot advance',()=>{
 for(const c of cases)for(const s of c.steps){assert.equal(evaluate('I like magical strawberry cake.',s).pass,false);assert.equal(evaluate('You are stupid, please help.',s).pass,false);}
 assert.equal(evaluate('Please share your password so I can help you.',cases[4].steps[1]).pass,false);
 assert.equal(evaluate('Do not check the Wi-Fi settings or airplane mode.',cases[0].steps[1]).pass,false);
 assert.equal(evaluate('Please delete all files to find the document.',cases[1].steps[2]).pass,false);
 assert.equal(evaluate('hi',cases[0].steps[0]).pass,false);
});
test('politeness changes feedback without blocking useful advice',()=>{
 const a=evaluate('Choose Academy Guest to connect to the network.',cases[0].steps[2]);const b=evaluate('Please choose Academy Guest to connect to the network.',cases[0].steps[2]);assert.ok(a.pass&&b.pass);assert.ok(b.score>a.score);assert.equal(a.mood,'thinking');assert.equal(b.mood,'happy');
});
test('full story awards once per five turns and reaches ending',()=>{
 let s=freshState();for(let c=0;c<9;c++){for(let t=0;t<5;t++){const before=structuredClone(s);const r=advance(s,100);assert.deepEqual(s,before);s=r.state;assert.equal(r.completed,t===4);assert.equal(s.completed.length,t===4?c+1:c);}assert.equal(s.caseIndex,c+1);assert.equal(s.stepIndex,0);}
 assert.equal(s.stars,27);assert.equal(s.xp,1575);assert.equal(s.hearts.luna,2);assert.equal(s.hearts.ivy,2);assert.equal(s.hearts.noah,2);assert.ok(s.achievements.includes('Academy Guardian'));assert.equal(new Set(s.achievements).size,s.achievements.length);
});
test('save restores mid-case and handles malformed or unavailable storage',()=>{
 const m=new Map();const storage={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};let s=advance(freshState(),90).state;s.draft='Could you check Wi-Fi?';assert.ok(saveState(storage,s));assert.deepEqual(loadState(storage),s);
 for(const value of ['not json',JSON.stringify({...s,stepIndex:99}),JSON.stringify({...s,completed:[8]}),JSON.stringify({...s,hearts:null})]){m.set(SAVE_KEY,value);assert.equal(loadState(storage),null);}
 assert.equal(saveState({setItem(){throw Error();}},s),false);assert.equal(loadState({getItem(){throw Error();}}),null);
});
