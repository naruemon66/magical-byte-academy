// All visible characters use genuine separate transparent files; no atlas crops.
const ids=['luna','mix','direx','celeste','noah','ivy','aurora','felix','mochi','serena'];
export const characterArt=Object.fromEntries(ids.map(id=>[id,{src:`./assets/characters/${id}.webp`,expressions:{},aspect:2/3}]));
export function resolveCharacterArt(id,mood='neutral'){
 const art=characterArt[id];if(!art)throw new Error(`Unknown character art: ${id}`);
 return {src:art.expressions[mood]||art.src,aspect:art.aspect,standalone:true};
}
