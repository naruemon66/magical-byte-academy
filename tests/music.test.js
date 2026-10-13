import test from 'node:test';import assert from 'node:assert/strict';import {MagicalMusic} from '../music.js';
class FakeContext {
 constructor(){this.state='suspended';this.currentTime=0;this.destination={};this.oscillators=[];this.gains=[];}
 createGain(){const gain={connect(){},disconnect(){},gain:{value:0,setTargetAtTime(v){this.value=v;},setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}}};this.gains.push(gain);return gain;}
 createOscillator(){const osc={frequency:{value:0},connect(){},disconnect(){},start(){this.started=true;},stop(){}};this.oscillators.push(osc);return osc;}
 async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}
}
test('original instrumental starts only after interaction, respects volume/mute, pauses for microphone and hidden tabs',async t=>{
 const music=new MagicalMusic({AudioContextClass:FakeContext});t.after(()=>music.dispose());music.configure({enabled:true,volume:.4});assert.equal(music.context,null);assert.ok(await music.start());assert.ok(music.context.oscillators.length>0);assert.ok(music.context.oscillators.every(o=>o.started&&o.frequency.value>0));assert.equal(music.master.gain.value,.12);
 await music.setDucked(true);assert.equal(music.context.state,'suspended');assert.equal(music.timer,null);await music.setDucked(false);assert.equal(music.context.state,'running');await music.setVisible(false);assert.equal(music.context.state,'suspended');await music.setVisible(true);assert.equal(music.context.state,'running');await music.configure({enabled:false});assert.equal(music.master.gain.value,0);assert.equal(music.context.state,'suspended');await music.setDucked(false);assert.equal(music.context.state,'suspended');
});
test('unsupported audio reports a readable fallback and never blocks gameplay',async()=>{const messages=[];const music=new MagicalMusic({AudioContextClass:null,onStatus:m=>messages.push(m)});assert.equal(await music.start(),false);assert.match(messages[0],/not supported/);await music.dispose();});
