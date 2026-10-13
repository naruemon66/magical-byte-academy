import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,advance,earnPoints,loadState} from '../engine.js';
import {characterArt,resolveCharacterArt} from '../character-art.js';
import {MUSIC_TEMPO} from '../music.js';
test('all ten finished portraits have distinct atlas cells and support custom transparent files and expressions',()=>{
 const cells=new Set();for(const [id,art] of Object.entries(characterArt)){const resolved=resolveCharacterArt(id);assert.equal(resolved.src,'./assets/cast.webp');cells.add(`${resolved.column},${resolved.row}`);assert.equal(resolved.aspect,.8);}
 assert.equal(cells.size,10);characterArt.luna.src='./assets/characters/luna.webp';characterArt.luna.expressions.happy='./assets/characters/luna-happy.png';assert.equal(resolveCharacterArt('luna','happy').src,'./assets/characters/luna-happy.png');assert.equal(resolveCharacterArt('luna','worried').standalone,true);characterArt.luna.src=null;characterArt.luna.expressions={};assert.throws(()=>resolveCharacterArt('unknown'));
});
test('points bank accepted story turns and practice without replacing earlier earnings',()=>{let s=freshState();s=advance(s,75).state;assert.equal(s.learningPoints,75);s=earnPoints(s,35);assert.equal(s.learningPoints,110);assert.equal(s.lastPointsEarned,35);assert.equal(s.stepIndex,1);assert.equal(s.xp,0);assert.throws(()=>earnPoints(s,NaN));assert.throws(()=>earnPoints(s,101));assert.equal(MUSIC_TEMPO,128);});
