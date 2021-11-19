import fetch from 'node-fetch';
import {MessageEmbed} from 'discord.js';
const url = 'https://supertool.vercel.app/apis/sololearn/codes/trending';

type trendApi =  {
lang : string, 
codeName: string,
codeLink : string,
votes : string,
codeDate : string,
author : {
    name : string,
    id : string,
    profileURL : string,
    avatarURL : string ,
  }
}[];



export default async function (){
  const obj:trendApi = await fetch(url)
    .then(r=>r.json());
  return obj.map(e=>{
    return new MessageEmbed({
      author:{
        name : 'Sololearn',
        icon_url:'https://media.discordapp.net/attachments/906985861525155880/906985890356793434/1a4d095737caeccfc65bcb30243f4b8f.png',
      },
      thumbnail : {url : e.author.avatarURL},
      title:'Trending',
      url:'https://www.sololearn.com/Codes',
      color:'#1f1e28',
      description:`‣ [${e.codeName}](${e.codeLink
        })\n    ⌙ language : ${e.lang.toUpperCase()
        }\n    ⌙ Author : [${e.author.name}](${e.author.profileURL
        })\n    ⌙ Votes : ${global.config.emojis.thumbsup} ${e.votes} ${global.config.emojis.thumbsdown
        }\n    ⌙ Last Updated : <t:${Math.ceil(+new Date(e.codeDate)/1000)
        }:R>`,
      timestamp:new Date()
    })
  })
  
}

