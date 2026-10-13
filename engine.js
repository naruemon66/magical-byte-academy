import {assessCommunication,communicationGuide} from './communication.js';
import {cases} from './story.js';
import {templates,materialize} from './templates.js';
export const SAVE_KEY='magical-byte-academy-v1'; // Keep the old key and migrate in place.
const blankEndless=()=>({completed:0,totalScore:0,bestScore:0,cycles:0,seenTemplates:[],bag:[],lastId:null,lastCharacter:null,active:null,friendships:{}});
export function freshState(){return {version:2,started:false,tutorialDone:false,mode:'story',caseIndex:0,stepIndex:0,completed:[],stars:0,xp:0,hearts:{},satisfaction:[],achievements:[],turnScores:[],attempts:0,settings:{motion:true,largeText:false},draft:'',vocabulary:[],endless:blankEndless()};}
const count=n=>Number.isSafeInteger(n)&&n>=0;
const scores=a=>Array.isArray(a)&&a.every(n=>Number.isFinite(n)&&n>=0&&n<=100);
const strings=a=>Array.isArray(a)&&a.every(n=>typeof n==='string');
const friendships=o=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.values(o).every(count);
export function loadState(storage){
 try{const raw=storage.getItem(SAVE_KEY);if(!raw)return null;const s=JSON.parse(raw);
 if(![1,2].includes(s.version)||!count(s.caseIndex)||s.caseIndex>cases.length||!count(s.stepIndex)||s.stepIndex>4||!Array.isArray(s.completed)||s.completed.some((v,i)=>v!==i)||s.completed.length>cases.length||s.caseIndex!==s.completed.length||!scores(s.turnScores)||s.turnScores.length!==s.stepIndex||!count(s.stars)||!count(s.xp)||!friendships(s.hearts)||!scores(s.satisfaction)||!strings(s.achievements))return null;
 const base=freshState();const migrated={...base,...s,version:2,started:s.started??true,tutorialDone:s.tutorialDone??true,settings:{...base.settings,...s.settings},draft:typeof s.draft==='string'?s.draft.slice(0,1200):'',vocabulary:strings(s.vocabulary)?s.vocabulary:[]};
 if(s.version===1){migrated.mode='story';migrated.endless=blankEndless();migrated.vocabulary=[...new Set(s.completed.flatMap(i=>cases[i].vocabulary.map(v=>v[0])))];return migrated;}
 const e=s.endless;const ids=templates.map(t=>t.id);
 if(!['story','endless'].includes(s.mode)||!e||!count(e.completed)||!count(e.totalScore)||!count(e.bestScore)||e.bestScore>100||!count(e.cycles)||!strings(e.bag)||new Set(e.bag).size!==e.bag.length||e.bag.some(id=>!ids.includes(id))||!strings(e.seenTemplates)||new Set(e.seenTemplates).size!==e.seenTemplates.length||e.seenTemplates.some(id=>!ids.includes(id))||!friendships(e.friendships))return null;
 if(e.active){const a=e.active;if(!ids.includes(a.templateId)||!count(a.variant)||!count(a.difficulty)||a.difficulty>2||!count(a.stepIndex)||a.stepIndex>4||!scores(a.turnScores)||a.turnScores.length!==a.stepIndex||typeof a.draft!=='string')return null;a.draft=a.draft.slice(0,1200);}
 if(s.mode==='endless'&&!e.active)migrated.mode='story';
 return migrated;
 }catch{return null;}
}
export function saveState(storage,state){try{storage.setItem(SAVE_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function normalize(text){return text.toLowerCase().replace(/[’']/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();}
function has(text,phrase){const escaped=phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const endings=phrase.includes(' ')?'(?:s)?':phrase.endsWith('e')?'(?:s|d|ing)?':'(?:s|es|ed|ing)?';
 const forms={choose:['choosing'],save:['saving'],share:['sharing'],use:['using'],change:['changing'],reproduce:['reproducing'],verify:['verifying'],priority:['priorities'],copy:['copies'],run:['running'],sign:['signing']};
 return new RegExp('(?:^|[^a-z0-9])(?:'+escaped+endings+(forms[phrase]?'|'+forms[phrase].join('|'):'')+')(?:$|[^a-z0-9])','i').test(text);}
export function evaluate(text,step){
 const n=normalize(text);const words=n.split(/\s+/).filter(Boolean);
 if(words.length<3)return {pass:false,score:0,mood:'worried',title:'Give your visitor a complete thought',details:['Write at least a short sentence explaining what you want to ask or recommend.'],lesson:step.hint};
 const unsafe=n.split(/[.!?;]|\b(?:but|and then)\b/).some(clause=>[/\b(?:send|share|give|tell)\b.{0,35}\b(?:password|passphrase)\b/,/\b(?:disable|turn off)\b.{0,25}\b(?:2fa|two.factor|antivirus|security)\b/,/\b(?:delete|erase|format)\b.{0,25}\b(?:all|everything|drive|files)\b/].some(r=>r.test(clause))&&!/\b(?:do not|dont|never|avoid|not to)\b/.test(clause));
 const rude=/\b(?:stupid|idiot|shut up|your fault|dumb)\b/.test(n);
 if(unsafe||rude)return {pass:false,score:0,mood:'worried',title:unsafe?'Protect the visitor and their data':'Try a more respectful response',details:[unsafe?'Do not request passwords, disable security, or delete data as a shortcut.':'Blaming or insulting a visitor makes it harder to solve the problem together.'],lesson:step.hint};
 const coverage=step.groups.map(g=>g.some(p=>has(n,p)));
 const communication=assessCommunication(text,step);
 const clarity=words.length>=6&&words.length<=110;
 const negated=/\b(?:do not|dont|never|not to)\b\s+(?:\w+\s+)?(?:check|test|save|report|contact|connect|select|choose|enable|change|reset)\b/.test(n);
 const technical=coverage.every(Boolean)&&!negated;
 const pass=technical&&!communication.errors.length&&communication.disagree;
 const raw=Math.round((coverage.filter(Boolean).length/coverage.length)*50+communication.points+(clarity?20:10));
 const score=communication.errors.length||!communication.disagree?Math.min(raw,45):communication.level==='Direct'?Math.min(raw,65):communication.level==='Polite'?Math.min(raw,85):raw;
 const details=[pass?'Your response addresses the required task. Compare its communication level to improve it further.':'This response needs revision before the conversation can continue.'];
 if(!technical)details.push(negated?'You seem to be telling the visitor not to perform a needed step. Rephrase the instruction.':`Include ${step.groups.filter((_,i)=>!coverage[i]).map(g=>g.slice(0,3).join(' / ')).join(' and ')} in a clear question or instruction.`);
 details.push(...communication.errors,communication.note,communication.pattern);
 if(communication.level==='Polite')details.push('For the strongest professional response, make the action specific and explain a relevant reason or follow-up.');
 if(!clarity)details.push('Aim for one or two clear sentences with a specific action or question.');
 details.push('These are selected Unit 4 rules, not a complete grammar, semantic, fluency, or pronunciation assessment. Use guided phrases if a valid expression is missed.');
 return {pass,score,mood:pass?(communication.level==='Professional'?'happy':'thinking'):'worried',title:pass?'A helpful response!':'Let us refine your response',details,lesson:step.lesson,communication,comparison:communicationGuide};
}
export function advance(state,score,totalCases=cases.length){
 if(state.caseIndex>=totalCases)throw new Error('Story is already complete');
 const next=structuredClone(state);next.turnScores.push(score);next.stepIndex++;next.draft='';next.attempts=0;
 if(next.stepIndex<5)return {state:next,completed:false};
 const satisfaction=Math.round(next.turnScores.reduce((a,b)=>a+b,0)/5);const stars=satisfaction>=90?3:satisfaction>=75?2:1;
 const index=next.caseIndex;const char=cases[index].character;
 next.completed.push(index);next.stars+=stars;next.xp+=100+stars*25;next.hearts[char]=(next.hearts[char]||0)+1;next.satisfaction.push(satisfaction);
 const unlock=name=>{if(!next.achievements.includes(name))next.achievements.push(name);};
 if(index===0)unlock('First Light');if(next.completed.length===3)unlock('A Friendly Beginning');if(next.completed.length===6)unlock('Troubleshooting Team');if(stars===3)unlock('Kind Communicator');if(next.completed.length===9)unlock('Academy Guardian');if(next.completed.length===totalCases)unlock('Chamber of Confidence');
 next.vocabulary=[...new Set([...next.vocabulary,...(cases[index].vocabulary||[]).map(v=>v[0])])];
 next.caseIndex++;next.stepIndex=0;next.turnScores=[];
 return {state:next,completed:true,reward:{stars,xp:100+stars*25,satisfaction,char,index}};
}
export function startEndless(state,rng=Math.random){
 if(state.caseIndex<cases.length)throw new Error('Complete the story to unlock Endless Support');
 const next=structuredClone(state);next.mode='endless';if(next.endless.active)return next;
 const e=next.endless;
 if(!e.bag.length){e.bag=templates.map(t=>t.id);for(let i=e.bag.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[e.bag[i],e.bag[j]]=[e.bag[j],e.bag[i]];}e.cycles++;}
 // Prefer another character as well as another template, including bag boundaries.
 let pick=e.bag.findIndex(id=>id!==e.lastId&&templates.find(t=>t.id===id).character!==e.lastCharacter);
 if(pick<0)pick=e.bag.findIndex(id=>id!==e.lastId);if(pick<0)pick=0;
 const [templateId]=e.bag.splice(pick,1);const template=templates.find(t=>t.id===templateId);
 e.lastId=templateId;e.lastCharacter=template.character;
 e.active={templateId,variant:(e.completed+e.cycles)%3,difficulty:Math.min(2,Math.floor(e.completed/10)),stepIndex:0,turnScores:[],draft:'',attempts:0};
 return next;
}
export function endlessCase(state){const a=state.endless.active;return a?materialize(a.templateId,a.variant,a.difficulty):null;}
export function advanceEndless(state,score){
 const next=structuredClone(state),e=next.endless,a=e.active;if(!a)throw new Error('No active endless case');
 a.turnScores.push(score);a.stepIndex++;a.draft='';a.attempts=0;if(a.stepIndex<5)return {state:next,completed:false};
 const satisfaction=Math.round(a.turnScores.reduce((p,v)=>p+v,0)/5),c=materialize(a.templateId,a.variant,a.difficulty);
 e.completed++;e.totalScore+=satisfaction;e.bestScore=Math.max(e.bestScore,satisfaction);e.friendships[c.character]=(e.friendships[c.character]||0)+1;e.seenTemplates=[...new Set([...e.seenTemplates,c.id])];
 next.vocabulary=[...new Set([...next.vocabulary,...c.vocabulary.map(v=>v[0])])];
 if(e.completed===1&&!next.achievements.includes('Always Here to Help'))next.achievements.push('Always Here to Help');if(e.seenTemplates.length===templates.length&&!next.achievements.includes('Thirty Ways to Help'))next.achievements.push('Thirty Ways to Help');
 e.active=null;
 return {state:next,completed:true,reward:{practice:true,endless:true,satisfaction,points:satisfaction,char:c.character,title:c.title}};
}
