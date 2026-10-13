// Six original advisor portraits, separate from every quest character.
export const advisorAvatars=[
 {id:'moon',src:'./assets/advisors/moon.webp',name:'Moon Weaver',role:'Connection Specialist'},
 {id:'flame',src:'./assets/advisors/flame.webp',name:'Flame Scholar',role:'Code Investigator'},
 {id:'grove',src:'./assets/advisors/grove.webp',name:'Grove Keeper',role:'Archive Guardian'},
 {id:'rune',src:'./assets/advisors/rune.webp',name:'Rune Sage',role:'Systems Advisor'},
 {id:'tide',src:'./assets/advisors/tide.webp',name:'Tide Oracle',role:'Data Protector'},
 {id:'storm',src:'./assets/advisors/storm.webp',name:'Storm Warden',role:'Network Guardian'}
];
export const advisorAvatar=id=>advisorAvatars.find(a=>a.id===id)||advisorAvatars[0];
