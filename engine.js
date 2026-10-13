import {assessCommunication,communicationGuide} from './communication.js';
import {cases} from './story.js';
import {templates,materialize} from './templates.js';
export const SAVE_KEY='magical-byte-academy-v1'; // Keep the old key and migrate in place.
const blankEndless=()=>({completed:0,totalScore:0,bestScore:0,cycles:0,seenTemplates:[],bag:[],lastId:null,lastCharacter:null,active:null,friendships:{}});
export function freshState(){return {version:2,highestUnlockedQuest:0,selectedQuest:0,replayMode:false,replaySession:null,questMenuOpen:true,learningPoints:0,importedPoints:0,lastPointsEarned:0,playerName:'',questResults:Array(cases.length).fill(null),started:false,tutorialDone:false,mode:'story',caseIndex:0,stepIndex:0,completed:[],stars:0,xp:0,hearts:{},satisfaction:[],achievements:[],turnScores:[],attempts:0,settings:{motion:true,largeText:false,music:true,musicVolume:.25},draft:'',vocabulary:[],endless:blankEndless()};}
const count=n=>Number.isSafeInteger(n)&&n>=0;
const scores=a=>Array.isArray(a)&&a.every(n=>Number.isFinite(n)&&n>=0&&n<=100);
const strings=a=>Array.isArray(a)&&a.every(n=>typeof n==='string');
const friendships=o=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.values(o).every(count);
export function loadState(storage){
 try{const raw=storage.getItem(SAVE_KEY);if(!raw)return null;const s=JSON.parse(raw);
 if(![1,2].includes(s.version)||!count(s.caseIndex)||s.caseIndex>cases.length||!count(s.stepIndex)||s.stepIndex>4||!Array.isArray(s.completed)||s.completed.some((v,i)=>v!==i)||s.completed.length>cases.length||s.caseIndex!==s.completed.length||!scores(s.turnScores)||s.turnScores.length!==s.stepIndex||!count(s.stars)||!count(s.xp)||!friendships(s.hearts)||!scores(s.satisfaction)||!strings(s.achievements))return null;
 const base=freshState();const migrated={...base,...s,version:2,started:s.started??true,tutorialDone:s.tutorialDone??true,settings:{...base.settings,...s.settings},draft:typeof s.draft==='string'?s.draft.slice(0,1200):'',vocabulary:strings(s.vocabulary)?s.vocabulary:[]};
 if(s.learningPoints!==undefined&&(!Number.isFinite(s.learningPoints)||s.learningPoints<0))return null;
 const recordedPoints=s.satisfaction.reduce((a,b)=>a+b,0)*5+s.turnScores.reduce((a,b)=>a+b,0)+(s.endless?.totalScore||0)*5+(s.endless?.active?.turnScores||[]).reduce((a,b)=>a+b,0);
 migrated.learningPoints=s.learningPoints??recordedPoints;
 migrated.importedPoints=Number.isFinite(s.importedPoints)&&s.importedPoints>=0?s.importedPoints:s.learningPoints===undefined?recordedPoints:0;
 migrated.lastPointsEarned=Number.isFinite(s.lastPointsEarned)&&s.lastPointsEarned>=0&&s.lastPointsEarned<=100?s.lastPointsEarned:0;
 migrated.highestUnlockedQuest=Math.min(s.completed.length,cases.length-1);
 migrated.selectedQuest=count(s.selectedQuest)&&s.selectedQuest<=migrated.highestUnlockedQuest?s.selectedQuest:Math.min(s.caseIndex,cases.length-1);
 migrated.questMenuOpen=typeof s.questMenuOpen==='boolean'?s.questMenuOpen:true;
 const replay=s.replaySession;
 migrated.replayMode=!!s.replayMode&&s.completed.includes(migrated.selectedQuest)&&replay?.caseIndex===migrated.selectedQuest&&count(replay.stepIndex)&&replay.stepIndex<=4&&scores(replay.turnScores)&&replay.turnScores.length===replay.stepIndex&&typeof replay.draft==='string';
 migrated.replaySession=migrated.replayMode?{caseIndex:replay.caseIndex,stepIndex:replay.stepIndex,turnScores:[...replay.turnScores],draft:replay.draft.slice(0,1200),attempts:count(replay.attempts)?replay.attempts:0}:null;
 if(!migrated.replayMode)migrated.selectedQuest=Math.min(s.caseIndex,cases.length-1);
 migrated.playerName=typeof s.playerName==='string'?s.playerName.trim().slice(0,32):'';
 if(s.questResults!==undefined&&(!Array.isArray(s.questResults)||s.questResults.length!==cases.length||s.questResults.some((r,i)=>r!==null&&(!s.completed.includes(i)||!Number.isFinite(r.bestScore)||r.bestScore<0||r.bestScore>100||!Number.isFinite(r.lastScore)||r.lastScore<0||r.lastScore>100||!count(r.attempts)||r.attempts<1))))return null;
 migrated.questResults=s.questResults||base.questResults;
 for(const i of s.completed)if(!migrated.questResults[i]){const score=s.satisfaction[i]??0;migrated.questResults[i]={bestScore:score,lastScore:score,attempts:1};}
 migrated.settings.music=typeof migrated.settings.music==='boolean'?migrated.settings.music:true;
 migrated.settings.musicVolume=Number.isFinite(migrated.settings.musicVolume)?Math.max(0,Math.min(1,migrated.settings.musicVolume)):.25;
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
 if(unsafe||rude)return {pass:false,score:0,mood:'worried',severe:true,technical:false,title:unsafe?'Protect the visitor and their data':'Try a more respectful response',details:[unsafe?'Do not request passwords, disable security, or delete data as a shortcut.':'Blaming or insulting a visitor makes it harder to solve the problem together.'],lesson:step.hint};
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
 return {pass,score,technical,severe:false,mood:pass?(communication.level==='Professional'?'happy':'thinking'):'worried',title:pass?'A helpful response!':'Let us refine your response',details,lesson:step.lesson,communication,comparison:communicationGuide};
}
export function advance(state,score,totalCases=cases.length){
 if(state.caseIndex>=totalCases)throw new Error('Story is already complete');
 const next=earnPoints(state,score);next.turnScores.push(score);next.stepIndex++;next.draft='';next.attempts=0;
 if(next.stepIndex<5)return {state:next,completed:false};
 const satisfaction=Math.round(next.turnScores.reduce((a,b)=>a+b,0)/5);const stars=satisfaction>=90?3:satisfaction>=75?2:1;
 const index=next.caseIndex;const char=cases[index].character;
 next.questResults[index]={bestScore:satisfaction,lastScore:satisfaction,attempts:1};
 next.completed.push(index);next.stars+=stars;next.xp+=100+stars*25;next.hearts[char]=(next.hearts[char]||0)+1;next.satisfaction.push(satisfaction);
 const unlock=name=>{if(!next.achievements.includes(name))next.achievements.push(name);};
 if(index===0)unlock('First Light');if(next.completed.length===3)unlock('A Friendly Beginning');if(next.completed.length===6)unlock('Troubleshooting Team');if(stars===3)unlock('Kind Communicator');if(next.completed.length===9)unlock('Academy Guardian');if(next.completed.length===totalCases)unlock('Chamber of Confidence');
 next.vocabulary=[...new Set([...next.vocabulary,...(cases[index].vocabulary||[]).map(v=>v[0])])];
 next.caseIndex++;next.highestUnlockedQuest=Math.min(next.caseIndex,cases.length-1);next.selectedQuest=next.highestUnlockedQuest;next.replayMode=false;next.replaySession=null;next.stepIndex=0;next.turnScores=[];
 return {state:next,completed:true,reward:{stars,xp:100+stars*25,satisfaction,rating:questRating(satisfaction),char,index}};
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
 const next=earnPoints(state,score),e=next.endless,a=e.active;if(!a)throw new Error('No active endless case');
 a.turnScores.push(score);a.stepIndex++;a.draft='';a.attempts=0;if(a.stepIndex<5)return {state:next,completed:false};
 const satisfaction=Math.round(a.turnScores.reduce((p,v)=>p+v,0)/5),c=materialize(a.templateId,a.variant,a.difficulty);
 e.completed++;e.totalScore+=satisfaction;e.bestScore=Math.max(e.bestScore,satisfaction);e.friendships[c.character]=(e.friendships[c.character]||0)+1;e.seenTemplates=[...new Set([...e.seenTemplates,c.id])];
 next.vocabulary=[...new Set([...next.vocabulary,...c.vocabulary.map(v=>v[0])])];
 if(e.completed===1&&!next.achievements.includes('Always Here to Help'))next.achievements.push('Always Here to Help');if(e.seenTemplates.length===templates.length&&!next.achievements.includes('Thirty Ways to Help'))next.achievements.push('Thirty Ways to Help');
 e.active=null;
 return {state:next,completed:true,reward:{practice:true,endless:true,satisfaction,points:satisfaction,char:c.character,title:c.title}};
}

export function questRating(score){return score>=95?5:score>=85?4:score>=75?3:score>=60?2:1;}
export function playerProgress(state){const level=1+Math.floor(state.xp/200);return {level,learningPoints:state.learningPoints||0,lastPointsEarned:state.lastPointsEarned||0,xpInLevel:state.xp%200,xpToNext:200-state.xp%200,totalScore:state.questResults.reduce((sum,r)=>sum+(r?.bestScore||0),0),maxScore:cases.length*100};}
export function improveQuest(state,index,score){
 if(!state.completed.includes(index)||!Number.isFinite(score)||score<0||score>100)throw new Error('Invalid completed-quest replay');
 const next=structuredClone(state),old=next.questResults[index]||{bestScore:next.satisfaction[index]||0,lastScore:0,attempts:1};
 const improved=score>old.bestScore;next.questResults[index]={bestScore:Math.max(old.bestScore,score),lastScore:score,attempts:old.attempts+1};
 return {state:next,improved,bestScore:next.questResults[index].bestScore,rating:questRating(next.questResults[index].bestScore)};
}

export function evaluateChoice(text,step){
 const result=evaluate(text,step);
 if(result.severe||!result.technical)return result;
 if(!result.pass)return {...result,pass:true,partial:true,score:35,mood:'thinking',title:'A useful idea with room to grow',details:['The technical action is relevant. You receive partial credit; revise the communication using the model reply.',...result.details.slice(1)]};
 return {...result,partial:result.score<100};
}
export function scoreTier(result){if(result.severe)return {name:'Safety first',icon:'🛡️',style:'safety'};if(result.score>=95)return {name:'Professional',icon:'💎',style:'professional'};if(result.score>=75)return {name:'Polite',icon:'🌟',style:'polite'};if(result.score>=50)return {name:'Direct',icon:'🪄',style:'direct'};return {name:'Growing skill',icon:'🌱',style:'learning'};}

export function earnPoints(state,score){
 if(!Number.isFinite(score)||score<0||score>100)throw new Error('Invalid earned score');
 const next=structuredClone(state);next.learningPoints=(next.learningPoints||0)+score;next.lastPointsEarned=score;return next;
}

export function questAccess(state,index){if(!Number.isInteger(index)||index<0||index>=cases.length)return 'Locked';if(state.completed.includes(index))return 'Completed';return index===state.caseIndex?'Available':'Locked';}
export function selectStoryQuest(state,index){
 if(questAccess(state,index)==='Locked')throw new Error('Quest is locked');const next=structuredClone(state);next.selectedQuest=index;next.replayMode=next.completed.includes(index);next.replaySession=next.replayMode?{caseIndex:index,stepIndex:0,turnScores:[],draft:'',attempts:0}:null;return next;
}
export function returnToStory(state){const next=structuredClone(state);next.selectedQuest=Math.min(next.caseIndex,cases.length-1);next.replayMode=false;next.replaySession=null;return next;}
