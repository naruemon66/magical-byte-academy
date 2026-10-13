import {appreciationMessage} from '../appreciation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,advance,earnPoints,loadState} from '../engine.js';
import {characterArt,resolveCharacterArt} from '../character-art.js';
import {MUSIC_TEMPO} from '../music.js';
test('all ten portraits are separate transparent files and expression overrides stay optional',()=>{
 const paths=new Set();for(const [id,art] of Object.entries(characterArt)){const resolved=resolveCharacterArt(id);assert.equal(resolved.src,`./assets/characters/${id}.webp`);paths.add(resolved.src);assert.equal(resolved.standalone,true);assert.ok(!('atlas' in art));}
 assert.equal(paths.size,10);characterArt.luna.expressions.happy='./assets/characters/luna-happy.png';assert.equal(resolveCharacterArt('luna','happy').src,'./assets/characters/luna-happy.png');characterArt.luna.expressions={};assert.throws(()=>resolveCharacterArt('unknown'));
});
test('points bank accepted story turns and practice without replacing earlier earnings',()=>{let s=freshState();s=advance(s,75).state;assert.equal(s.learningPoints,75);s=earnPoints(s,35);assert.equal(s.learningPoints,110);assert.equal(s.lastPointsEarned,35);assert.equal(s.stepIndex,1);assert.equal(s.xp,0);assert.throws(()=>earnPoints(s,NaN));assert.throws(()=>earnPoints(s,101));assert.equal(MUSIC_TEMPO,128);});

test('appreciation is character-specific and reflects the completed story problem',()=>{const words=Object.keys(characterArt).map(id=>appreciationMessage(id,'other','practice'));assert.equal(new Set(words).size,10);assert.match(appreciationMessage('luna','moon-wifi'),/Academy-Guest/);assert.match(appreciationMessage('luna','frozen'),/writing/);assert.ok(!appreciationMessage('luna','moon-wifi','practice').includes('Academy-Guest'));});
