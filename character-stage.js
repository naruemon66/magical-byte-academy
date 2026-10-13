import * as T from './assets/vendor/three.module.js';
// Original real-time geometry. No image planes are used for the characters.
const designs={luna:['#b68afa','#6631a3','long','#ffd8c6'],mix:['#242035','#a83151','spiky','#e8af87'],direx:['#bfc4db','#343f89','beard','#e7baa0'],celeste:['#191829','#258969','bob','#b17d60'],noah:['#714732','#258e9c','short','#d5a07c'],ivy:['#efc36b','#e973ab','long','#ffe0c9'],aurora:['#d6e3fa','#315ccb','curls','#85503c'],felix:['#263656','#cf882a','short','#f0c2a0'],mochi:['#eee0cf','#a79bd6','cat','#eee0cf'],serena:['#dce2ef','#eee3ca','bun','#eecdb6']};
const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.58,...extra});
export function createCharacter(id){
 const [hairColor,robeColor,style,skinColor]=designs[id]||designs.luna;
 const root=new T.Group(),hips=new T.Bone(),spine=new T.Bone(),head=new T.Bone();hips.position.y=.85;spine.position.y=.65;head.position.y=.6;hips.add(spine);spine.add(head);root.add(hips);
 const skin=mat(skinColor),hair=mat(hairColor),robe=mat(robeColor),gold=mat('#f6d485',{metalness:.55,roughness:.3});
 const add=(parent,geometry,material,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
 const ball=(parent,material,x,y,z,sx,sy,sz)=>add(parent,new T.SphereGeometry(1,24,16),material,x,y,z,sx,sy,sz);
 // The robe is genuinely skinned to the hip and spine bones.
 const geometry=new T.CylinderGeometry(.28,.53,1.15,28,12);geometry.translate(0,1.15,0);
 const positions=geometry.attributes.position,indices=[],weights=[];
 for(let i=0;i<positions.count;i++){const w=T.MathUtils.clamp((positions.getY(i)-.85)/.65,0,1);indices.push(0,1,0,0);weights.push(1-w,w,0,0);}
 geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));
 const dress=new T.SkinnedMesh(geometry,robe);root.add(dress);root.updateMatrixWorld(true);dress.bind(new T.Skeleton([hips,spine]));
 ball(spine,robe,0,.05,0,.34,.35,.22);
 ball(head,skin,0,.09,0,.39,.48,.34);ball(head,skin,-.38,.05,0,.065,.12,.06);ball(head,skin,.38,.05,0,.065,.12,.06);
 const eyes=mat('#f9f5ff'),iris=mat(id==='mochi'?'#69b47e':'#675496'),dark=mat('#211c38');
 for(const x of [-.145,.145]){ball(head,eyes,x,.14,.295,.102,.125,.045);ball(head,iris,x,.14,.334,.057,.076,.018);ball(head,dark,x,.14,.348,.026,.048,.009);ball(head,eyes,x-.019,.173,.36,.016,.02,.008);ball(head,hair,x,.3,.285,.115,.018,.03);}
 ball(head,skin,0,.045,.346,.035,.055,.045);ball(head,mat('#b55f76'),0,-.12,.316,.065,.016,.016);
 ball(head,hair,0,.26,-.03,.405,.355,.34);
 const locks=[];const tube=(parent,points,radius,material)=>add(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),14,radius,8,false),material);
 for(let i=0;i<9;i++){const x=(i-4)*.083; tube(head,[[x,.5,.05],[x-.03,.37,.29],[x+.04,.22+(i%3)*.035,.31]],.049,hair);}
 for(const side of [-1,1])for(let i=0;i<4;i++){const bone=new T.Bone();bone.position.set(side*(.29+i*.018),.29,-.1-i*.065);head.add(bone);locks.push(bone);const length=style==='long'?1.05:style==='bob'?.53:style==='curls'?.64:.29;const points=Array.from({length:9},(_,j)=>[side*(.015+Math.sin(j*1.3+i)*.055),-j*length/8,Math.cos(j*.9+i)*.055]);tube(bone,points,style==='curls'?.08:.062,hair);}
 if(style==='bun')ball(head,hair,0,.48,-.27,.23,.23,.2);
 if(style==='spiky')for(let i=0;i<7;i++){const spike=add(head,new T.ConeGeometry(.085,.32,8),hair,(i-3)*.095,.55,-.07);spike.rotation.z=(i-3)*-.16;}
 if(style==='beard'){ball(head,hair,0,-.26,.21,.29,.31,.18);}
 if(style==='cat'){for(const side of [-1,1]){add(head,new T.ConeGeometry(.14,.33,3),hair,side*.26,.55,0);ball(head,mat('#efadbd'),side*.26,.56,.075,.07,.09,.02);}ball(head,mat('#da9da2'),0,.045,.37,.055,.034,.025);}
 for(const side of [-1,1]){const arm=new T.Bone();arm.position.set(side*.29,.13,0);spine.add(arm);arm.rotation.z=side*.16;ball(arm,robe,side*.065,-.25,0,.13,.37,.14);ball(arm,skin,side*.075,-.6,.02,.095,.13,.09);ball(hips,mat('#30283e'),side*.17,-.69,0,.12,.2,.16);}
 // Collar, clasp, belt and a floating magical jewel are actual 3D meshes.
 for(const side of [-1,1]){const collar=add(spine,new T.ConeGeometry(.13,.3,3),gold,side*.13,.23,.22);collar.rotation.z=side*.6;}
 ball(spine,gold,0,.07,.265,.067,.067,.035);ball(spine,mat('#b9efff',{emissive:'#568cff',emissiveIntensity:.6}),0,.07,.297,.035,.035,.023);
 const belt=add(hips,new T.TorusGeometry(.36,.024,8,32),gold,0,.12,0);belt.rotation.x=Math.PI/2;belt.scale.y=.67;
 root.userData={hips,spine,head,locks,id,skinned:true};return root;
}
let renderer,scene,camera,model,frame,host,character,motion=true,start=performance.now(),lastFrame=0;
export function setCharacterMotion(value){motion=value&&!matchMedia('(prefers-reduced-motion: reduce)').matches;}
export function mountCharacter(element,id){
 if(!element){host=null;cancelAnimationFrame(frame);return;}
 host=element;
 try{
 if(!renderer){renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;scene=new T.Scene();camera=new T.PerspectiveCamera(32,1,.1,40);camera.position.set(0,1.65,5.2);camera.lookAt(0,1.55,0);scene.add(new T.HemisphereLight('#eef0ff','#65505d',2));const key=new T.DirectionalLight('#fff0d9',3);key.position.set(-3,4,5);scene.add(key);const rim=new T.DirectionalLight('#b99eff',2);rim.position.set(3,3,-2);scene.add(rim);renderer.domElement.setAttribute('aria-hidden','true');}
 if(character!==id){if(model){scene.remove(model);model.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}model=createCharacter(id);scene.add(model);character=id;}
 element.replaceChildren(renderer.domElement);element.dataset.renderer='webgl';element.dataset.character=id;
 cancelAnimationFrame(frame);let dirty=true,previousWidth=0,previousHeight=0;
 const draw=()=>{if(!host||!host.isConnected)return;if(performance.now()-lastFrame<33){frame=requestAnimationFrame(draw);return;}lastFrame=performance.now();const width=host.clientWidth,height=host.clientHeight;if(width&&height){const resized=width!==previousWidth||height!==previousHeight;previousWidth=width;previousHeight=height;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();const t=(performance.now()-start)/1000;const rig=model.userData;rig.hips.rotation.z=motion?Math.sin(t*.9)*.018:0;rig.spine.rotation.y=motion?Math.sin(t*.7)*.07:0;rig.head.rotation.z=motion?Math.sin(t*.6)*.025:0;rig.locks.forEach((b,i)=>b.rotation.z=motion?Math.sin(t*1.5+i*.5)*.055:0);if(!document.hidden&&(motion||dirty||resized)){renderer.render(scene,camera);dirty=false;}}frame=requestAnimationFrame(draw);};draw();
 }catch(error){element.dataset.renderer='unavailable';element.innerHTML='<p class="model-unavailable">3D requires WebGL. Your learning activities still work.</p>';console.warn('3D renderer unavailable:',error.message);}
}
