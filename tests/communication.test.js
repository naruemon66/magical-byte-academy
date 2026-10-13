import test from 'node:test';import assert from 'node:assert/strict';
import {cases} from '../story.js';import {templates,materialize} from '../templates.js';import {evaluate} from '../engine.js';import {teamTemplates} from '../team-talk.js';
test('each turn has four distinct choices and one genuinely strongest professional response',()=>{
 for(const c of [...cases,...templates.flatMap(t=>[0,1,2].map(d=>materialize(t.id,0,d)))])for(const s of c.steps){
  assert.equal(s.choices.length,4);assert.equal(new Set(s.choices.map(o=>o.text)).size,4,`${c.id}:${s.phase}`);assert.equal(s.choices.filter(o=>o.best).length,1);
  for(const o of s.choices){const r=evaluate(o.text,s);if(o.best){assert.ok(r.pass,`${c.id}:${s.phase}`);assert.equal(r.score,100);assert.equal(r.communication.level,'Professional');}else assert.ok(r.score<100,`${c.id}:${s.phase}:${o.id}`);if(o.id==='revise')assert.equal(r.pass,false);}
 }
});
test('multiple natural modals and contractions receive equal professional credit',()=>{
 const s=cases[0].steps[1];const alternatives=[
 'Could you please check whether Wi-Fi is enabled and airplane mode is off so that we can identify the problem?',
 'Would you mind checking Wi-Fi and airplane mode so that we can identify the problem?',
 'Could you check Wi-Fi and airplane mode because the settings may explain the problem?',
 'May I ask you to check Wi-Fi and airplane mode so that we can understand the connection issue?'];
 for(const text of alternatives){const r=evaluate(text,s);assert.ok(r.pass,text);assert.equal(r.score,100,text);}
 const advice=cases[0].steps[2];for(const text of ['May I suggest that we select Academy-Guest because it is the intended network?','May I suggest connecting to Academy-Guest because it is the official network?','Would you mind selecting Academy-Guest because it is the official network?','We could join Academy-Guest so that you can continue your lesson.','Shall we connect to Academy-Guest because it is the official network?']){const r=evaluate(text,advice);assert.ok(r.pass,text);assert.equal(r.score,100);}
 const greeting=cases[0].steps[0];assert.equal(evaluate("Hello, I'd be happy to help. Could you tell me about the issue?",greeting).score,100);assert.equal(evaluate('Hello, I would be happy to help. Could you tell me about the issue?',greeting).score,100);
});
test('please alone, unsafe advice, and incorrect modal constructions cannot earn top scores',()=>{
 const s=cases[0].steps[1];for(const text of ['Would you mind to check Wi-Fi and airplane mode?','Would you mind check Wi-Fi and airplane mode?','Could you please checking Wi-Fi and airplane mode?','Could you please to check Wi-Fi and airplane mode?']){const r=evaluate(text,s);assert.equal(r.pass,false,text);assert.match(r.details.join(' '),/base verb|-ing/);}
 const action=cases[0].steps[2];assert.ok(evaluate('Please select Academy-Guest and connect.',action).score<100);assert.ok(evaluate('Could you please bake a cake?',action).score<100);assert.equal(evaluate('Could you please share your password so I can help?',action).pass,false);
});
test('Disagree + Suggest requires acknowledgment, concern, safe alternative, and reason',()=>{
 const s=materialize('team-review').steps[2];const full='I appreciate your idea, but a regression is a risk. We could add regression tests before merging because existing behavior needs protection.';assert.equal(evaluate(full,s).score,100);
 for(const text of ['Please add regression tests before merging.','I disagree. Add regression tests before merging.','I see your point, but add regression tests before merging.']){const r=evaluate(text,s);assert.equal(r.pass,false);assert.match(r.details.join(' '),/Disagree \+ Suggest/);}
});
test('all five Team Talk scenarios contain functioning five-turn tasks and taught vocabulary',()=>{
 assert.equal(teamTemplates.length,5);for(const t of teamTemplates){const c=materialize(t.id,0,1);assert.equal(c.steps.length,5);assert.ok(c.vocabulary.length>=2);for(const s of c.steps)assert.ok(evaluate(s.example,s).pass);}
});
