// Existing original solo portraits reused as selectable advisor appearances.
export const advisorAvatars=[
 {id:'moon',art:'luna',name:'Moon Weaver',role:'Connection Specialist'},
 {id:'flame',art:'mix',name:'Flame Scholar',role:'Code Investigator'},
 {id:'grove',art:'celeste',name:'Grove Keeper',role:'Archive Guardian'},
 {id:'rune',art:'direx',name:'Rune Sage',role:'Systems Advisor'},
 {id:'tide',art:'aurora',name:'Tide Oracle',role:'Data Protector'},
 {id:'storm',art:'felix',name:'Storm Warden',role:'Network Guardian'}
];
export const advisorAvatar=id=>advisorAvatars.find(a=>a.id===id)||advisorAvatars[0];
