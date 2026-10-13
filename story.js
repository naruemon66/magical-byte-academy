import {cases as originalCases,characters,chapters,phases} from './cases.js';
import {prepareStep} from './communication.js';
import {requestModels} from './request-models.js';
import {storyExtras} from './templates.js';
// Original indices stay stable so an existing V1 save resumes the same support turn.
const vocabulary=[
 [['Wi-Fi','A wireless network connection.'],['airplane mode','A setting that disables wireless connections.']],
 [['backup','An extra copy for recovery.'],['folder','A container for related files.']],
 [['mirror','Show the same content on two screens.'],['projector','A device that displays an image on a larger surface.']],
 [['syntax','Rules for writing valid program structure.'],['parenthesis','A curved bracket used in code.']],
 [['passphrase','A longer password made from several words.'],['two-factor authentication','An additional identity check beyond a password.']],
 [['autosave','Automatically saving work at intervals.'],['unresponsive','Not reacting to user input.']],
 [['phishing','Deceptive messages that seek information or access.'],['sender','The apparent source of a message.']],
 [['outage','A period when a service is unavailable.'],['scope','The extent of a problem.']],
 [['incident','An event that disrupts normal service.'],['status update','A report of known conditions and next actions.']]
];
const reasons={
 'moon-wifi':['wireless settings can prevent a connection','the official guest network is the intended connection','a connected Wi-Fi icon does not prove internet access'],
 'lost-files':['a file name and location make the search more precise','searching first avoids unnecessary changes to files','a separate copy helps protect the list from loss'],
 'projector':['a powered projector still needs the correct input','Mirror mode shows the same content on both screens','testing the presentation checks the actual classroom task'],
 'syntax':['the error message identifies evidence we can investigate','a function call needs matching parentheses','valid syntax does not guarantee the expected behavior'],
 'password':['your password should stay private during support','unique credentials and a second factor add protection','reusing a stolen password can expose other accounts'],
 'frozen':['closing the app could discard unsaved work','saving first reduces the risk of losing your paragraph','regular saving limits the amount of work that could be lost'],
 'phishing':['a display name alone does not prove who sent an email','the security team can investigate without exposing your account','the official site avoids returning to the suspicious link'],
 'network':['comparing devices helps identify the scope of the outage','authorized staff should handle shared infrastructure','successful requests across devices help confirm recovery'],
 'crisis':['a useful incident report needs symptoms and scope','a factual update helps users understand the next action','the real user task must work before recovery is announced']
};
export const cases=[...originalCases.map((c,i)=>({...c,vocabulary:vocabulary[i],steps:c.steps.map(step=>prepareStep(step,{reason:reasons[c.id]?.[step.phase-1],...(step.phase===1?{polite:requestModels[c.id]}:{}),...(c.id==='phishing'&&step.phase===2?{polite:'Please do not click the link. Report the email to the academy IT team.',professional:'I understand your idea, but clicking an unverified link is a risk. We could avoid clicking and report the email to the academy IT team instead because the sender is suspicious.'}:{}),...(c.id==='moon-wifi'&&step.phase===3?{polite:'Could you please open a website and check your internet connection?',professional:'Shall we open a website to check your internet connection? If it fails, we could check your Wi-Fi settings first because a connected icon does not prove internet access.'}:{}),...(c.id==='frozen'&&step.phase===2?{polite:'Could you please close and reopen the application after saving your work?',professional:'We could close and reopen the application after saving your work because saving first reduces the risk of losing your paragraph.'}:{})}))})),...storyExtras];
export {characters,chapters,phases};
