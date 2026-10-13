// Original instrumental score, synthesized locally. No recording, lyrics, CDN,
// external licensing, or network dependency. User interaction starts the audio.
export const MUSIC_TEMPO=128;
// Distinct motifs, keys, rhythms and lead timbres for academy + twelve visitors.
const motifs=[ [0,4,7,12,9,7,4,2,0,7,11,14,12,9,7,4], [0,7,4,9,7,2,4,12,11,7,9,4,2,7,4,0], [0,2,7,4,12,7,9,11,7,4,2,9,7,12,4,2] ];
export const MUSIC_THEMES=Object.fromEntries([
 ['academy','Academy Overture',128,0,0,'triangle'],['luna','Moonlit Connections',132,2,1,'sine'],['celeste','Enchanted Archives',136,5,2,'triangle'],['direx','Royal Rune March',132,-2,0,'triangle'],['mix','Code Spark Carnival',148,7,2,'triangle'],['mochi','Mischievous Paw Waltz',144,4,1,'sine'],['orion','Owl Courier Flight',140,9,0,'sine'],['serena','Sapphire Court',134,1,2,'triangle'],['felix','Network Tower Dance',146,6,1,'triangle'],['ember','Dragon Festival',152,3,0,'triangle'],['noah','Clockwork Inventions',142,8,2,'sine'],['aurora','Starlight Data Dance',138,10,1,'sine'],['ivy','Chamber of Discovery',136,11,0,'triangle']
].map(([id,name,tempo,key,motif,type])=>[id,{name,tempo,type,melody:motifs[motif].map((n,i)=>72+key+n+(i%4===3?12:0)),chords:[[48+key,55+key,60+key],[53+key,60+key,65+key],[50+key,57+key,62+key],[55+key,62+key,67+key]],rhythm:motif===1?[1,1,.5,1.5]:motif===2?[.75,1.25,1,1]:[1,1,1,1]}]));
// Six individually authored arrangements, with different meter, voicing and percussion.
const arrangements={
 academy:{tempo:132,instrument:'harp',description:'Royal harp · flowing strings',meter:8,melody:[72,76,79,84,83,79,76,74,72,67,72,76,79,76,74,71,69,72,77,81,79,77,74,72,71,74,79,83,86,83,79,74],rhythm:[1,1,1,1],bass:[48,53,57,55]},
 luna:{tempo:138,instrument:'flute',description:'Airy flute · dancing chimes',meter:8,melody:[74,null,78,81,83,81,78,null,76,78,81,null,85,83,81,78,83,85,88,85,83,null,81,78,76,74,73,null,76,78,81,74],rhythm:[1.5,.5,1,1],bass:[50,57,55,57]},
 mix:{tempo:154,instrument:'clockwork',description:'Clockwork plucks · syncopated pulse',meter:8,melody:[67,74,null,70,67,null,77,74,65,72,75,null,72,68,null,75,63,70,74,null,70,67,75,null,62,69,null,74,77,74,69,62],rhythm:[.5,1.5,.5,1.5],bass:[43,41,39,46]},
 mochi:{tempo:144,instrument:'pizzicato',description:'Playful pizzicato · three-beat waltz',meter:6,melody:[72,79,76,72,74,76,77,null,81,79,77,74,76,83,79,76,74,71,72,null,67,72,76,79],rhythm:[1,1,1],bass:[48,53,52,55]},
 ember:{tempo:150,instrument:'brass',description:'Festival brass · marching drums',meter:8,melody:[60,60,67,72,null,70,67,65,63,63,70,75,null,73,70,67,65,65,72,77,75,72,70,null,67,70,74,79,77,74,70,67],rhythm:[1,1,.5,1.5],bass:[36,39,41,43]},
 aurora:{tempo:136,instrument:'glass',description:'Crystal bells · sparkling arpeggios',meter:8,melody:[84,91,88,95,86,93,89,96,83,90,86,93,81,88,84,91,79,86,83,90,81,88,84,91,83,90,86,93,84,91,88,96],rhythm:[.75,.75,1.5,1],bass:[48,47,45,43]}
};
for(const [id,a] of Object.entries(arrangements))Object.assign(MUSIC_THEMES[id],a,{chords:a.bass.map(root=>[root,root+7,root+12])});
export const MUSIC_PLAYLIST=Object.keys(arrangements).map(id=>({id,...MUSIC_THEMES[id]}));
export class MagicalMusic {
 constructor({onStatus=()=>{},AudioContextClass=globalThis.AudioContext||globalThis.webkitAudioContext}={}){this.Context=AudioContextClass;this.onStatus=onStatus;this.context=null;this.master=null;this.timer=null;this.enabled=true;this.volume=.25;this.ducked=false;this.visible=true;this.started=false;this.tick=0;this.next=0;this.themeId='academy';this.voices=new Set();}
 async start(){this.started=true;if(!this.enabled||!this.visible||this.ducked)return false;if(!this.Context){this.onStatus('Background music is not supported in this browser.');return false;}
 try{if(!this.context){this.context=new this.Context();this.master=this.context.createGain();this.master.connect(this.context.destination);}await this.context.resume();if(!this.enabled||!this.visible||this.ducked){await this.pause();return false;}if(this.context.state!=='running'){this.onStatus('Tap Music to allow background audio.');return false;}this.master.gain.setTargetAtTime(this.volume*.3,this.context.currentTime,.15);if(!this.timer){this.next=this.context.currentTime+.08;this.schedule();this.timer=setInterval(()=>this.schedule(),120);}this.onStatus(`Original magical instrumental music is playing · ${MUSIC_THEMES[this.themeId].name}.`);return true;}catch{this.onStatus('Audio could not start. Tap Music to retry.');return false;}}
 configure({enabled=this.enabled,volume=this.volume}={}){this.enabled=enabled;this.volume=Math.max(0,Math.min(1,volume));if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!this.ducked?this.volume*.3:0,this.context.currentTime,.15);if(!enabled)this.pause();else if(this.started&&this.visible&&!this.ducked)return this.start();}
 async pause(){if(this.timer){clearInterval(this.timer);this.timer=null;}if(this.context){this.master.gain.setTargetAtTime(0,this.context.currentTime,.03);try{await this.context.suspend();}catch{}}}
 async setDucked(value){this.ducked=value;if(value)await this.pause();else if(this.started&&this.enabled&&this.visible)await this.start();}
 async setVisible(value){this.visible=value;if(!value)await this.pause();else if(this.started&&this.enabled&&!this.ducked)await this.start();}
 setTheme(id){const next=MUSIC_THEMES[id]?id:'academy';if(next===this.themeId)return;this.themeId=next;this.tick=0;if(this.context){for(const voice of this.voices){try{voice.stop(this.context.currentTime+.03);}catch{}}this.voices.clear();this.next=this.context.currentTime+.08;if(this.enabled&&!this.ducked&&this.visible&&this.context.state==='running'){this.schedule();this.onStatus(`Original magical instrumental music is playing · ${MUSIC_THEMES[next].name}.`);}}}
 schedule(){if(!this.context||this.context.state!=='running')return;const track=MUSIC_THEMES[this.themeId];let count=0;while(this.next<this.context.currentTime+.6&&count++<10){this.playStep(track,this.tick,this.next);this.next+=60/track.tempo/2*track.rhythm[this.tick%track.rhythm.length];this.tick++;}}
 playStep(track,tick,time){const bar=track.meter||8,beat=tick%bar,chord=track.chords[Math.floor(tick/bar)%track.chords.length],note=track.melody[tick%track.melody.length],kind=track.instrument||'harp';
 if(note!==null){
 if(kind==='harp'){this.tone(note,time,.43,.19,'triangle');this.tone(note+12,time,.22,.035,'sine');}
 else if(kind==='flute'){this.tone(note,time,.48,.18,'sine',.075);this.tone(note+12,time,.32,.025,'triangle',.065);}
 else if(kind==='clockwork'){this.tone(note,time,.12,.11,'square');this.tone(note+12,time,.07,.035,'triangle');}
 else if(kind==='pizzicato'){this.tone(note-12,time,.13,.23,'triangle');this.tone(note,time,.1,.025,'sine');}
 else if(kind==='brass'){this.tone(note,time,.22,.08,'sawtooth',.035);this.tone(note+12,time,.2,.055,'triangle',.035);}
 else{this.tone(note,time,.85,.13,'sine');this.tone(note+19,time,.48,.045,'sine');this.tone(note+28,time,.25,.018,'sine');}
 }
 if(kind==='pizzicato'){if(beat===0)this.tone(chord[0]-12,time,.22,.15,'triangle');if(beat===2||beat===4)for(const n of chord)this.tone(n+12,time,.12,.055,'triangle');}
 else if(kind==='clockwork'){if(beat===0||beat===3||beat===6)this.tone(chord[0]-12,time,.1,.13,'triangle');if(beat===2||beat===6)this.tone(42,time,.05,.07,'triangle');}
 else if(kind==='brass'){if(beat%2===0){this.tone(30,time,.09,.14,'sine');this.tone(chord[0]-12,time,.18,.1,'triangle');}if(beat===2||beat===6)this.tone(49,time,.055,.08,'triangle');if(beat===0)for(const n of chord)this.tone(n+12,time,.38,.035,'sawtooth');}
 else if(kind==='glass'){this.tone(chord[beat%3]+12,time,.28,.05,'sine');if(beat===0)this.tone(chord[0]-12,time,.65,.075,'sine');}
 else if(kind==='flute'){if(beat===0)for(const n of chord)this.tone(n,time,1.1,.045,'sine',.12);if(beat===3||beat===7)this.tone(note===null?86:note+12,time,.3,.04,'sine');}
 else{if(beat===0)for(const n of chord)this.tone(n,time,.95,.045,'sine',.1);if(beat%2===0)this.tone(chord[0]-12,time,.2,.11,'sine');}
 }

 tone(note,time,duration,level,type,attack=.015){const osc=this.context.createOscillator(),gain=this.context.createGain();osc.type=type;osc.frequency.value=440*2**((note-69)/12);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(level,time+attack);gain.gain.exponentialRampToValueAtTime(.001,time+duration);osc.connect(gain);gain.connect(this.master);this.voices.add(osc);osc.start(time);osc.stop(time+duration+.04);osc.onended=()=>{this.voices.delete(osc);osc.disconnect();gain.disconnect();};}
 async dispose(){await this.pause();if(this.context){try{await this.context.close();}catch{}}}
}
