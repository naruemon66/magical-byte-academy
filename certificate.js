// Original canvas document renderer and offline PNG/PDF exports. No external API.
const image=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(`Artwork could not load: ${src}`));i.src=src;});
function fitted(ctx,img,x,y,w,h){const scale=Math.min(w/img.width,h/img.height);ctx.drawImage(img,x+(w-img.width*scale)/2,y+(h-img.height*scale)/2,img.width*scale,img.height*scale);}
export async function createCertificate(state,characterIds){
 await document.fonts.ready;const paths=['./assets/branding/royal-crest.webp','./assets/branding/guide-orb.webp','./assets/branding/crest-small.webp',...characterIds.map(id=>`./assets/characters/${id}.webp`)];const assets=await Promise.all(paths.map(image));
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1120;const c=canvas.getContext('2d');
 const background=c.createLinearGradient(0,0,1600,1120);background.addColorStop(0,'#fff8e5');background.addColorStop(.5,'#f3e6cd');background.addColorStop(1,'#eee0f2');c.fillStyle=background;c.fillRect(0,0,1600,1120);
 c.strokeStyle='#80602e';c.lineWidth=14;c.strokeRect(30,30,1540,1060);c.strokeStyle='#d6b16a';c.lineWidth=3;c.strokeRect(53,53,1494,1014);c.strokeRect(64,64,1472,992);
 for(const [x,y] of [[82,82],[1518,82],[82,1038],[1518,1038]]){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillStyle='#766093';c.fillRect(-12,-12,24,24);c.strokeStyle='#b99650';c.lineWidth=3;c.strokeRect(-17,-17,34,34);c.restore();}
 fitted(c,assets[0],650,74,300,245);fitted(c,assets[1],1390,95,96,96);
 // A faded circular royal stamp clipped into the upper-left parchment corner.
 c.save();c.beginPath();c.rect(64,64,1472,992);c.clip();c.translate(99,92);c.rotate(-.22);c.globalAlpha=.38;c.strokeStyle='#81344d';c.fillStyle='#81344d';c.lineWidth=4;
 for(const radius of [100,91,66]){c.beginPath();c.arc(0,0,radius,0,Math.PI*2);c.stroke();}
 c.textAlign='center';c.font='17px AcademyDisplay, Georgia, serif';c.fillText('ARCANEXUS',0,9);c.font='13px AcademyText, serif';c.fillText('ROYAL ACADEMY',0,28);c.font='34px AcademyDisplay, serif';c.fillText('A',0,-14);c.restore();
 const text=(value,y,size,color='#463257',family='AcademyDisplay',align='center',x=800)=>{c.fillStyle=color;c.textAlign=align;c.font=`${size}px ${family}, Georgia, serif`;c.fillText(value,x,y);};
 text('BY ROYAL DECREE',350,28,'#84662f');text('ARCANEXUS ACADEMY',410,58,'#4a335c');text('Certificate of Magical IT Service',473,42,'#80602e');text('This royal commendation is proudly presented to',533,25,'#635472','AcademyText');
 const name=state.playerName||'Magical IT Advisor';let fontSize=62;c.font=`${fontSize}px AcademyDisplay, sans-serif`;while(c.measureText(name).width>1270&&fontSize>25)c.font=`${--fontSize}px AcademyDisplay, sans-serif`;text(name,609,fontSize,'#473260');
 c.strokeStyle='#c6a563';c.lineWidth=2;c.beginPath();c.moveTo(310,632);c.lineTo(1290,632);c.stroke();text('For completing all twelve quests with care, courage and clear English communication.',680,24,'#5c4b66','AcademyText');text('Where Ancient Magic Meets Modern Technology',719,22,'#8b6c3d','AcademyText');
 const average=state.satisfaction.length?Math.round(state.satisfaction.reduce((a,b)=>a+b,0)/state.satisfaction.length):0;
 const stats=[['Quests completed',`${state.completed.length} / 12`],['Magic Stars',`${state.stars} / 36`],['Experience',`${state.xp} XP`],['Story satisfaction',`${average}%`]];
 stats.forEach(([label,value],i)=>{const x=164+i*326;c.fillStyle='#302943';c.fillRect(x,760,298,111);c.strokeStyle='#cfa965';c.strokeRect(x,760,298,111);text(label,795,19,'#e8d4ac','AcademyText','center',x+149);text(value,843,34,'#ffdfa0','AcademyDisplay','center',x+149);});
 const humans=characterIds.filter(id=>!['mochi','orion','ember'].includes(id));humans.forEach((id,i)=>fitted(c,assets[3+characterIds.indexOf(id)],100+i*38,885,75,143));['mochi','orion','ember'].forEach((id,i)=>fitted(c,assets[3+characterIds.indexOf(id)],205+i*72,990,67,62));
 fitted(c,assets[2],1275,886,130,130);text('ARCANEXUS ACADEMY',1030,23,'#5a3c70','AcademyDisplay','center',1340);
 text(`Total earned points: ${state.learningPoints.toLocaleString()}`,935,23,'#64546b','AcademyText');text(`Presented on ${new Date(state.certificateIssuedAt||Date.now()).toLocaleDateString('en-GB',{timeZone:'Asia/Bangkok'})}`,974,20,'#77684e','AcademyText');text('A royal keepsake of your Arcanexus Academy journey',1020,19,'#776a80','AcademyText');
 return canvas;
}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function downloadCertificatePNG(canvas,name='arcanexus-certificate.png'){canvas.toBlob(blob=>{if(blob)download(blob,name);},'image/png');}
export function certificatePDF(canvas){
 const pageHeight=842*canvas.height/canvas.width;const raw=atob(canvas.toDataURL('image/jpeg',.95).split(',')[1]),jpeg=Uint8Array.from(raw,c=>c.charCodeAt(0)),encode=s=>new TextEncoder().encode(s),chunks=[],offsets=[0];let size=0;const push=b=>{chunks.push(b);size+=b.length;};
 push(encode('%PDF-1.4\n'));const object=(n,body)=>{offsets[n]=size;push(encode(`${n} 0 obj\n${body}\nendobj\n`));};
 object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');object(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
 offsets[4]=size;push(encode(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`));push(jpeg);push(encode('\nendstream\nendobj\n'));
 const commands=`q 842 0 0 ${pageHeight} 0 0 cm /Im0 Do Q`;object(5,`<< /Length ${encode(commands).length} >>\nstream\n${commands}\nendstream`);const xref=size;push(encode(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));return new Blob(chunks,{type:'application/pdf'});
}
export function downloadCertificatePDF(canvas,name='arcanexus-certificate.pdf'){download(certificatePDF(canvas),name);}
