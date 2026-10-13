import {cases as originalCases,characters,chapters,phases} from './cases.js';
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
export const cases=[...originalCases.map((c,i)=>({...c,vocabulary:vocabulary[i]})),...storyExtras];
export {characters,chapters,phases};
