import {resolveCharacterArt} from './character-art.js';
let host=null;
export function setCharacterMotion(value){document.body.classList.toggle('character-motion-off',!value);}
export function mountCharacter(element,id,mood='neutral'){
 host=element;if(!element)return;
 element.dataset.artState='loading';element.dataset.renderer='illustration';element.dataset.character=id;
 const visual=document.createElement('div');visual.className='character-idle';
 const reaction=document.createElement('div');reaction.className='character-reaction';
 const sprite=document.createElement('div');sprite.className='character-sprite';sprite.setAttribute('aria-hidden','true');
 reaction.append(sprite);visual.append(reaction);element.replaceChildren(visual);
 setCharacterMood(mood);animateCharacterSpeech();
}
export function setCharacterMood(mood='neutral'){
 if(!host?.isConnected)return;
 const art=resolveCharacterArt(host.dataset.character,mood),sprite=host.querySelector('.character-sprite');
 host.closest('#portrait').dataset.mood=mood;
 const target=host;sprite.dataset.source=art.src;
 sprite.style.aspectRatio=String(art.aspect);
 sprite.style.backgroundImage=`url(${JSON.stringify(art.src)})`;
 sprite.style.backgroundSize=art.standalone?'contain':`${art.columns*100}% ${art.rows*100}%`;
 sprite.style.backgroundPosition=art.standalone?'center bottom':`${art.column*100/(art.columns-1)}% ${art.row*100/(art.rows-1)}%`;
 const probe=new Image();probe.onload=()=>{if(sprite.isConnected&&sprite.dataset.source===art.src){target.dataset.artState='ready';}};
 probe.onerror=()=>{if(!sprite.isConnected||sprite.dataset.source!==art.src)return;const notice=document.createElement('p');notice.className='character-art-error';notice.setAttribute('role','status');notice.textContent='Character artwork could not load. Please reload to retry; learning activities remain available.';sprite.replaceChildren(notice);target.dataset.artState='error';};probe.src=art.src;
}
export function animateCharacterSpeech(){
 if(!host?.isConnected)return;const reaction=host.querySelector('.character-reaction');reaction.classList.remove('is-speaking');void reaction.offsetWidth;reaction.classList.add('is-speaking');
}
