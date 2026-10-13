// Replace `src` with a transparent PNG/WebP URL to install individual artwork.
// `expressions` may contain neutral, worried, thinking, happy, or surprised URLs.
const ids=['luna','mix','direx','celeste','noah','ivy','aurora','felix','mochi','serena'];
export const characterArt=Object.fromEntries(ids.map((id,index)=>[id,{src:null,expressions:{},atlas:'./assets/cast.webp',column:index%5,row:Math.floor(index/5),columns:5,rows:2,aspect:4/5}]));
export function resolveCharacterArt(id,mood='neutral'){
 const art=characterArt[id];if(!art)throw new Error(`Unknown character art: ${id}`);
 const src=art.expressions[mood]||art.src;
 return src?{src,aspect:art.aspect,standalone:true}:{src:art.atlas,aspect:art.aspect,standalone:false,column:art.column,row:art.row,columns:art.columns,rows:art.rows};
}
