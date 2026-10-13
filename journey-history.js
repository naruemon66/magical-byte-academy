// Separate archive: restarting the live save never deletes past journeys.
export const HISTORY_KEY='arcanexus-journey-history-v1';
export function readHistory(storage){const raw=storage.getItem(HISTORY_KEY);if(!raw)return {version:1,activeId:null,entries:[]};const h=JSON.parse(raw);if(h.version!==1||!Array.isArray(h.entries)||h.entries.some(e=>!e.id||!e.stats||!Array.isArray(e.stats.completed)))throw Error('The journey archive could not be read.');return h;}
const played=s=>s.completed.length>0||s.stepIndex>0||s.attempts>0||s.learningPoints>0||s.endless.completed>0;
export function recordJourney(storage,state,characterIds,now=new Date().toISOString()){
 const h=readHistory(storage);if(!played(state))return null;
 let entry=h.entries.find(e=>e.id===h.activeId);
 if(!entry){entry={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,startedAt:now,updatedAt:now,status:'In progress',stats:null,certificate:null};h.activeId=entry.id;h.entries.push(entry);}
 entry.updatedAt=now;entry.stats=structuredClone({playerName:state.playerName,completed:state.completed,stars:state.stars,xp:state.xp,learningPoints:state.learningPoints,satisfaction:state.satisfaction,endlessCompleted:state.endless.completed});
 if(state.completed.length===12&&!entry.certificate){entry.completedAt=now;entry.certificate={...structuredClone(entry.stats),certificateIssuedAt:now,characterIds:[...characterIds]};}
 entry.status=entry.certificate?'Graduated':'In progress';storage.setItem(HISTORY_KEY,JSON.stringify(h));return entry;
}
export function closeJourney(storage,state,characterIds,now){if(!played(state)){const existing=readHistory(storage);if(!existing.activeId)return;}recordJourney(storage,state,characterIds,now);const h=readHistory(storage),entry=h.entries.find(e=>e.id===h.activeId);if(entry&&!entry.certificate)entry.status='Ended early';h.activeId=null;storage.setItem(HISTORY_KEY,JSON.stringify(h));}
