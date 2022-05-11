let block :{[index:string] :string|undefined } ={};
let prefix = [">>","?:"][+(process.env.BETA??0)];

export default {
  prefix,
  ownerId: "800445583046213663",
  guildId: "856090036998635520",

  roles : {
    "betaTesters" : "903716928391094332",
  },

  channels: {
    errorLog: "857648123676459058",
    bugReport: "861422096852844544",
    feedback: "856907506612830241",
    suggestion: "874308146728943636",
    serverLog : "857636955553398814",
  },
  
  emojis: {
    thumbsup: "<:thumbsup:862862241136115732>",
    thumbsdown: "<:thumbsdown:862862298556399656>",
    think: "<:chadThink:862312026608369695>",
    sad: "<:sed:860576595039354931>",
    ok: "<:ok:861456928184860672>",
    cry: "<a:sadGuitar:869172267869949962>",
    aha: "<a:aha:858172419792961657>",
    nono: "<:noNOno:831705934648573982>",
    yus: "<a:yusSor:862567696898195476>",
    sneak: "<:sneakPeek:852714216057733180>",
    dance: "<a:dancingBear:855432117180432384>",
    ping: "<a:pingPong:855558851726409759>",
    evilLaugh: "<:voldyLaugh:854700368126541834>",
    evilAttack: "<:voldyAttack:853598830632763432>",
    quick: "<:quick:856818054602948608>",
    knife: "<a:knifeBear:901369113656561744>",
    salute: "<:salute:895714590996955176>",
    rollCat: "<a:rolling_cat:971076987009503293>",

    // swift: "<:swift:917731222891929630>",
    // r: "<:r_:933080757688229938>",
    //rust: "<:rust:917731110857867334>",
    // rb: "<:ruby:917730481821331496>",
    // py: "<:python:917730409826091038>",
    // php: "<:php:917731059993542667>",
    // node: "<:nodeJs:917730548548521985>",
    // kt: "<:kotlin:917731162640769024>",
    //js: "<:js:917729840281579530>",
    // java: "<:java:917730341916147732>",
    // web: "<:html:917729778507857921>",
    // go: "<:go:917730616961826846>",
    //css: "<:css:917729986155249664>",
    // cs: "<:cSharp:917730272512974918>",
    // cpp: "<:cpp:917730073312894986>",
    // c: "<:c_:917730189297995818>",
  },
    
  block,
}
