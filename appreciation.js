const gratitude={
 orion:'Hoot! Your careful steps kept my archive record safe. I will remember to save before trying a risky fix.',
 ember:'You helped me turn worry into a clear plan. Thank you for guiding our festival team with calm, honest updates.',
 luna:'You made it easier to ask for help. I feel much more confident now.',
 celeste:'Your patient questions helped me trace the clues. My reading can continue!',
 direx:'Clear instructions are a fine kind of magic. Thank you for guiding me with care.',
 mix:'That was excellent teamwork. I am ready to build something wonderful again!',
 mochi:'Purr… you listened carefully and kept my magical things safe. You have earned my trust.',
 serena:'Your calm, professional communication helped us protect the academy. Well done.',
 felix:'You explained each step clearly. Working together made the challenge manageable.',
 noah:'Thanks for checking the details with me. My workshop is ready for another bright idea!',
 aurora:'Your careful advice helped protect my work. I truly appreciate your attention to detail.',
 ivy:'You gave me a clear way forward. That is the kind of helpful communication worth practicing.'
};
const storyNotes={
 'moon-wifi':'Now I can connect to Academy-Guest and return to my lessons.',
 'lost-files':'My reading list is back where it belongs. You helped me stay calm while we searched.',
 projector:'My presentation can finally begin. Those careful checks saved the lesson.',
 syntax:'My spell is working again. You helped me understand the error instead of guessing.',
 password:'My account is safer now. Thank you for explaining how to protect it.',
 frozen:'My writing is safe and the app is responding again. What a relief!',
 phishing:'I know how to report that suspicious message safely. Thank you for protecting our information.',
 network:'The pages are loading again. Your step-by-step approach really helped.',
 crisis:'The festival portal is back. Your clear updates helped our team through the incident.',
 'device-power':'My computer is starting again. Thank you for checking the power safely.',
 'research-backup':'My research now has a reliable backup plan. That gives me peace of mind.',
 'meeting-audio':'Everyone can hear me in the meeting now. Thank you for helping me reconnect.'
};
export function appreciationMessage(character,caseId,mode='story'){
 const personal=gratitude[character]||'Thank you for working through the problem with me.';
 return mode==='story'&&storyNotes[caseId]?`${personal} ${storyNotes[caseId]}`:personal;
}
