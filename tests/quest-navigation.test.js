import test from 'node:test';import assert from 'node:assert/strict';
import {freshState,advance,questAccess,selectStoryQuest,returnToStory,loadState,SAVE_KEY} from '../engine.js';
import {cases} from '../story.js';
test('every unlocked quest survives selecting any previous quest without changing main progress or rewards',()=>{
 let s=freshState();for(let current=0;current<cases.length;current++){
 assert.equal(questAccess(s,current),'Available');if(current+1<cases.length){assert.equal(questAccess(s,current+1),'Locked');assert.throws(()=>selectStoryQuest(s,current+1));}
 for(let previous=0;previous<current;previous++){const r=selectStoryQuest(s,previous);assert.equal(r.selectedQuest,previous);assert.equal(r.replayMode,true);for(const key of ['caseIndex','highestUnlockedQuest','completed','stars','xp','hearts','questResults','draft','turnScores','learningPoints'])assert.deepEqual(r[key],s[key]);const back=returnToStory(r);assert.equal(back.caseIndex,current);assert.equal(back.selectedQuest,current);assert.equal(back.replayMode,false);}
 for(let turn=0;turn<5;turn++)s=advance(s,100).state;assert.equal(s.highestUnlockedQuest,Math.min(current+1,cases.length-1));
 }
});
test('old saves migrate unlocks from completed quests and restore independent replay/menu fields',()=>{let s=freshState();for(let i=0;i<10;i++)s=advance(s,100).state;s.draft='Continue this draft';s=selectStoryQuest(s,0);s.replaySession.draft='Practice draft';s.questMenuOpen=false;const storage={getItem:()=>JSON.stringify(s)};assert.deepEqual(loadState(storage),s);const old=structuredClone(s);delete old.highestUnlockedQuest;delete old.selectedQuest;delete old.replayMode;delete old.replaySession;delete old.questMenuOpen;const migrated=loadState({getItem:()=>JSON.stringify(old)});assert.equal(migrated.highestUnlockedQuest,2);assert.equal(migrated.selectedQuest,2);assert.equal(migrated.draft,'Continue this draft');assert.equal(migrated.questMenuOpen,true);const stale={...s,highestUnlockedQuest:0};assert.equal(loadState({getItem:()=>JSON.stringify(stale)}).highestUnlockedQuest,2);});
