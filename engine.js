export const SAVE_KEY='magical-byte-academy-v1';
export function freshState(){return {version:1,caseIndex:0,stepIndex:0,completed:[],stars:0,xp:0,hearts:{},satisfaction:[],achievements:[],turnScores:[],attempts:0,settings:{motion:true,largeText:false},draft:''};}
export function loadState(storage){
 try{const raw=storage.getItem(SAVE_KEY);if(!raw)return null;const s=JSON.parse(raw);
 if(s.version!==1||!Number.isInteger(s.caseIndex)||s.caseIndex<0||s.caseIndex>9||!Number.isInteger(s.stepIndex)||s.stepIndex<0||s.stepIndex>4||!Array.isArray(s.completed)||s.completed.some((v,i)=>v!==i)||s.completed.length>9||s.caseIndex!==s.completed.length||!Array.isArray(s.turnScores)||s.turnScores.length!==s.stepIndex||s.turnScores.some(n=>!Number.isFinite(n)||n<0||n>100)||!Number.isFinite(s.stars)||s.stars<0||!Number.isFinite(s.xp)||s.xp<0||typeof s.hearts!=='object'||!s.hearts||Array.isArray(s.hearts)||Object.values(s.hearts).some(n=>!Number.isFinite(n)||n<0)||!Array.isArray(s.satisfaction)||s.satisfaction.some(n=>!Number.isFinite(n))||!Array.isArray(s.achievements)||s.achievements.some(n=>typeof n!=='string'))return null;
 return {...freshState(),...s,settings:{...freshState().settings,...s.settings},draft:typeof s.draft==='string'?s.draft.slice(0,1200):''};}catch{return null;}
}
export function saveState(storage,state){try{storage.setItem(SAVE_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function normalize(text){return text.toLowerCase().replace(/[’']/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();}
function has(text,phrase){const escaped=phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(?:^|[^a-z0-9])'+escaped+'(?:s)?(?:$|[^a-z0-9])','i').test(text);}
export function evaluate(text,step){
 const n=normalize(text);const words=n.split(/\s+/).filter(Boolean);
 if(words.length<3)return {pass:false,score:0,mood:'worried',title:'Give your visitor a complete thought',details:['Write at least a short sentence explaining what you want to ask or recommend.'],lesson:step.hint};
 const unsafe=[/\b(?:send|share|give|tell)\b.{0,35}\b(?:password|passphrase)\b/,/\b(?:disable|turn off)\b.{0,25}\b(?:2fa|two.factor|antivirus|security)\b/,/\b(?:delete|erase|format)\b.{0,25}\b(?:all|everything|drive|files)\b/].some(r=>r.test(n))&&!/\b(?:do not|dont|never|avoid|not to)\b/.test(n);
 const rude=/\b(?:stupid|idiot|shut up|your fault|dumb)\b/.test(n);
 if(unsafe||rude)return {pass:false,score:0,mood:'worried',title:unsafe?'Protect the visitor and their data':'Try a more respectful response',details:[unsafe?'Do not request passwords, disable security, or delete data as a shortcut.':'Blaming or insulting a visitor makes it harder to solve the problem together.'],lesson:step.hint};
 const coverage=step.groups.map(g=>g.some(p=>has(n,p)));
 const polite=/\b(?:please|could|would|thank|hello|hi|welcome|may|glad|happy)\b/.test(n)||/\bcan (?:i|you|we)\b/.test(n);
 const clarity=words.length>=6&&words.length<=90;
 const negated=/\b(?:do not|dont|never|not to)\b.{0,18}\b(?:check|test|save|report|contact|connect|select|choose|enable|change|reset)\b/.test(n);
 const pass=coverage.every(Boolean)&&!negated;
 const score=Math.round((coverage.filter(Boolean).length/coverage.length)*60+(polite?20:5)+(clarity?20:10));
 const details=[pass?'Your response includes the communication intent and technical points this turn checks.':'The response does not yet cover all the points needed for this situation.'];
 if(!pass)details.push(negated?'You seem to be telling the visitor not to perform a needed step. Rephrase the instruction.':`Include ${step.groups.filter((_,i)=>!coverage[i]).map(g=>g.slice(0,3).join(' / ')).join(' and ')} in a clear question or instruction.`);
 details.push(polite?'Your polite wording helps the visitor feel supported.':'Try “please”, “could you”, or a friendly acknowledgment to make the response warmer.');
 if(!clarity)details.push('Aim for one or two clear sentences, with a specific action or question.');
 details.push('This is a rule-based intent check, not a grammar, fluency, or pronunciation assessment. If it misses a valid answer, use the guided phrases.');
 return {pass,score,mood:pass?(polite?'happy':'thinking'):'worried',title:pass?'A helpful response!':'Let us refine your response',details,lesson:step.lesson};
}
export function advance(state,score,totalCases=9){
 const next=structuredClone(state);next.turnScores.push(score);next.stepIndex++;next.draft='';next.attempts=0;
 if(next.stepIndex<5)return {state:next,completed:false};
 const satisfaction=Math.round(next.turnScores.reduce((a,b)=>a+b,0)/5);const stars=satisfaction>=90?3:satisfaction>=75?2:1;
 const index=next.caseIndex;const chars=['luna','celeste','ivy','noah','mochi','luna','ivy','noah','pixel'];const char=chars[index];
 next.completed.push(index);next.stars+=stars;next.xp+=100+stars*25;next.hearts[char]=(next.hearts[char]||0)+1;next.satisfaction.push(satisfaction);
 if(index===0)next.achievements.push('First Light');if(next.completed.length===3)next.achievements.push('A Friendly Beginning');if(next.completed.length===6)next.achievements.push('Troubleshooting Team');if(stars===3&&!next.achievements.includes('Kind Communicator'))next.achievements.push('Kind Communicator');if(next.completed.length===totalCases)next.achievements.push('Academy Guardian');
 next.caseIndex++;next.stepIndex=0;next.turnScores=[];
 return {state:next,completed:true,reward:{stars,xp:100+stars*25,satisfaction,char,index}};
}
