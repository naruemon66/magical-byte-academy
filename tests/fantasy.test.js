import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,advance,earnPoints,loadState} from '../engine.js';
import {createCharacter} from '../character-stage.js';
import {MUSIC_TEMPO} from '../music.js';
test('real geometry has skinned bones and distinct hair rigs for all ten visitors',()=>{
 for(const id of ['luna','mix','direx','celeste','noah','ivy','aurora','felix','mochi','serena']){const m=createCharacter(id);let skin=0,vertices=0;m.traverse(o=>{if(o.isSkinnedMesh){skin++;assert.ok(o.skeleton.bones.length>=2);}vertices+=o.geometry?.attributes.position.count||0;});assert.equal(skin,1);assert.ok(vertices>5000);assert.equal(m.userData.locks.length,8);}
});
test('points bank accepted story turns and practice without replacing earlier earnings',()=>{let s=freshState();s=advance(s,75).state;assert.equal(s.learningPoints,75);s=earnPoints(s,35);assert.equal(s.learningPoints,110);assert.equal(s.lastPointsEarned,35);assert.equal(s.stepIndex,1);assert.equal(s.xp,0);assert.throws(()=>earnPoints(s,NaN));assert.throws(()=>earnPoints(s,101));assert.equal(MUSIC_TEMPO,128);});
