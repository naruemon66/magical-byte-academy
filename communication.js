// Unit 4 teaching rules. These inspect selected functional-language patterns,
// not full grammar or semantic meaning. The same rules serve typed/transcribed text.
export const communicationGuide={
 Direct:'Direct communication states an action plainly. It can be appropriate for an urgent safety warning, but a bare command may sound abrupt in routine support.',
 Polite:'Polite communication respects the listener’s choice: “Could you please + base verb” or “Would you mind + -ing” softens a request.',
 Professional:'Professional communication combines an appropriate tone, a specific safe action, and a useful reason or next step. Adding “please” cannot make unsafe or incorrect advice professional.',
 Disagree:'Disagree + Suggest: acknowledge the idea, explain the concern without blaming the person, and propose a workable alternative: “I see your point, but… We could… because…”.'
};
const norm=s=>s.toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim();
export function assessCommunication(text,step){
 const n=norm(text),phase=step.phase;
 const errors=[];
 if(/\bwould you mind (?:to\b|please to\b)/.test(n))errors.push('Use “Would you mind + -ing”, not “Would you mind to + verb”.');
 if(/\bwould you mind (?:please )?(?:check|select|open|run|test|save|close|share|help|review|send|report|explain|keep|prioritize|split|pair|add|use|choose|back)\b/.test(n))errors.push('After “Would you mind”, use an -ing form, for example “checking” or “reviewing”.');
 if(/\b(?:could|would|can|shall) (?:you|we|i) (?:please )?(?:to\b|checking\b|confirming\b|reviewing\b|testing\b|saving\b|selecting\b|helping\b|checks\b|helps\b|shall\b|id\b)/.test(n))errors.push('After a modal and subject, use the base verb: “Could you please check…?” or “Shall we review…?”.');
 if(/\bmay i (?:suggests|suggesting|to suggest)\b/.test(n))errors.push('Use “May I suggest…?” with the base verb “suggest”.');
 if(/\bmay i suggest (?:to|we could to)\b/.test(n))errors.push('Use “May I suggest + -ing” or “May I suggest that we + base verb”.');
 const request=/\b(?:could|would|can) you (?:please )?\w+|\bwould you mind (?:not )?\w+ing\b|\bmay i ask\b/.test(n);
 const proposal=/\bmay i suggest\b|\b(?:we could|could we) (?!to\b)\w+|\bshall we (?!to\b)\w+|\bhow about \w+ing\b|\blets \w+/.test(n);
 const explicitOffer=/\b(?:id|i would|i will|ill) be happy to help\b|\b(?:im|i am) happy to help\b/.test(n);
 const offer=/\b(?:id|i would|i will|ill) be happy to help\b|\b(?:im|i am) happy to help\b|\bmay i help\b|\bhow can i (?:help|assist)\b/.test(n);
 const courtesy=/\b(?:please|thank|thanks|hello|welcome|glad|happy|appreciate)\b/.test(n);
 const reason=/\b(?:because|so that|in order to)\b.{5,}|\bto (?:protect|avoid|verify|confirm|check|keep|prevent|preserve|reduce|ensure|understand|test|identify|find)\b/.test(n);
 const acknowledge=/\b(?:i (?:see|understand|appreciate|hear|get)|that (?:makes sense|is understandable)|i agree|your idea|your concern)\b/.test(n);
 const concern=/\b(?:but|however|concern|risk|instead|rather than|might|may)\b/.test(n);
 const alternative=/\b(?:we could|could we|shall we|may i suggest|instead|how about|lets)\b/.test(n);
 const disagree=!step.communication?.disagreement||(acknowledge&&concern&&alternative&&reason);
 const safetyDirect=/\b(?:do not|dont|never|avoid)\b/.test(n)&&/\b(?:click|share|password|security)\b/.test(n);
 const appropriate=phase===0?(offer||courtesy):phase===1?request:phase===4?courtesy&&(offer||/\b(?:help|contact|let me know|return)\b/.test(n)):(proposal||request||safetyDirect);
 let level=appropriate&&((phase===0&&explicitOffer&&request)||(phase===4&&explicitOffer)||((phase===1||phase===2||phase===3)&&reason))?'Professional':request||proposal||offer||courtesy?'Polite':'Direct';
 if(errors.length)level='Needs revision';
 return {level,errors,reason,appropriate,safetyDirect,disagree,points:errors.length?0:level==='Professional'?30:level==='Polite'?20:10,
 note:errors[0]||(!disagree?communicationGuide.Disagree:communicationGuide[level]),
 pattern:request?'Request: Could you please + base verb / Would you mind + -ing':proposal?'Suggestion: May I suggest / We could / Shall we':offer?'Offer: I’d be happy to help':safetyDirect?'Clear safety warning: a direct instruction can be appropriate':'Use a functional expression that fits the task, not just a politeness keyword.'};
}
function base(text){return text.replace(/^Please\s+/i,'').replace(/^Could you (?:please )?/i,'').replace(/^Would you mind /i,'').replace(/[.!?]$/,'');}
const gerunds={check:'checking',tell:'telling',share:'sharing',explain:'explaining',record:'recording',clarify:'clarifying',confirm:'confirming'};
function responseAlternatives(text,phase){
 if(phase===0)return [text,"Hello! I would be happy to help. Would you mind sharing the details of the problem?","Welcome! I’m happy to help. Could you please explain what happened?"];
 if(phase===4)return [text,"Thank you for visiting. I am happy to help again; please contact us if you need further support.","Thank you for your patience. I'd be happy to help again. Please let me know if anything else comes up."];
 let second=text.replace(/May I suggest that we/i,'We could').replace(/Shall we/i,'We could').replace(/Could you please/i,'Would you please').replace(/Would you mind confirming/i,'Could you please confirm').replace(/May I ask/i,'Could you please tell me');
 let third=text.replace(/We could/i,'Shall we').replace(/May I suggest that we/i,'Shall we').replace(/Could you please (check|tell|share|explain|record|clarify|confirm)/i,(_,verb)=>'Would you mind '+gerunds[verb.toLowerCase()]).replace(/Would you mind confirming/i,'Would you please confirm').replace(/May I ask/i,'Would you mind telling me');
 if(second===text)second=text+' We could review the next step together.';
 if(third===text||third===second)third=text+' I would be happy to help with the next step.';
 return [text,second,third];
}
export function prepareStep(original,metadata={}){
 const step=structuredClone(original);step.communication={...metadata,...step.communication};
 step.groups=step.groups.filter(g=>!g.every(word=>['please','could','would'].includes(word)));
 const direct=step.communication.direct||step.example;
 let polite=step.communication.polite,professional=step.communication.professional;
 const action=base(direct).replace(/^After saving (.+?), (.*)$/i,'$2 after saving $1'),reason=step.communication.reason||'we can verify the result before moving on';
 if(step.phase===0){polite||='Hello! How can I help you today?';professional||="Hello! I’d be happy to help. Could you please tell me more about the problem?";}
 else if(step.phase===4){polite||='Thank you for visiting. Please contact us if you need more help.';professional||="Thank you for your patience. I’d be happy to help again; please let me know if you need further support.";}
 else if(step.phase===1){
  polite||=/^Could you/i.test(direct)?direct.replace(/^Could you (?:please )?/i,'Could you please '):/^(what|which|where|is|are|do|can)/i.test(direct)?'Could you please clarify these details? '+direct:'Could you please '+action[0].toLowerCase()+action.slice(1)+'?';
  professional||=polite.replace(/[.!?]$/,'')+`? This will help us because ${reason}.`;
 }else{
  if(/^If /i.test(direct)){polite||='Please remember: '+direct;professional||=direct+' We could use a unique password for each account to protect the others.';}
  const clauses=action.split(/(?<=[.!?])\s+/),first=clauses.shift().replace(/[.!?]$/,''),rest=clauses.join(' ');
  polite||='Could you please '+first[0].toLowerCase()+first.slice(1)+'?'+(rest?' '+rest+'.':'');
  professional||='May I suggest that we '+first[0].toLowerCase()+first.slice(1)+`? ${rest?rest+'. ':''}This is useful because ${reason}.`;
 }
 step.example=professional;step.alternatives=responseAlternatives(professional,step.phase);
 if(step.phase===2||step.phase===3){polite=polite.replace(/ to (check|test|verify|confirm|protect|avoid|keep|prevent|preserve|reduce|ensure|understand|identify|find) /g,' and $1 ').replace(/\. If it fails, /,' and, if it fails, ');}
 const wrong=step.phase===2?'Could you please share your password with me so I can fix this?':step.phase===0?'Please give me your password so I can help.':step.phase===4?'Thanks. Your problem was stupid; do not come back.':`Would you mind to ${action[0].toLowerCase()+action.slice(1)}?`;
 step.communication.direct=direct;step.communication.polite=polite;step.communication.professional=professional;
 const options=[
  {id:'direct',text:step.phase===0?'Hello. Tell me how I can help.':step.phase===4?'Thanks. Contact us for help.':direct.replace(/^Please /i,'').replace(/^Could you (?:please )?/i,'').replace(/\?$/,'.').replace(/^./,c=>c.toUpperCase()),explanation:'This covers the task directly. Compare its tone with the more collaborative professional response.'},
  {id:'polite',text:polite,explanation:'This is courteous, but the best response also provides a clear reason or a useful next step.'},
  {id:'professional',text:professional,best:true,explanation:'Best response: appropriate functional language, the required safe technical action, and a relevant reason or follow-up.'},
  {id:'revise',text:wrong,explanation:(step.phase===0||step.phase===2)?'A polite word or a modal cannot justify requesting someone’s password.':step.phase===4?'Blaming a visitor is unprofessional, even with “thanks”.':'“Would you mind” takes an -ing form, not “to + verb”. Polite-sounding words do not repair the grammar.'}
 ];
 // Stable varied positions. Choices are never labeled with their answer level beforehand.
 const seed=[...direct].reduce((a,c)=>a+c.charCodeAt(0),step.phase)%4;
 step.choices=[...options.slice(seed),...options.slice(0,seed)];return step;
}
