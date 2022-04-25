import {SlashCommand} from 'Interfaces';
import {Collection, GuildEmoji} from 'discord.js';

export const command : SlashCommand= {
  name : 'e',
  description : 'sends emoji for you!',
  options : [
    {
      name : 'query',
      description : 'emoji name to query',
      type : 'STRING',
      required : true,
      autocomplete: true,
    },
    {
      name: "size",
      description: "raw emoji size:",
      type: 'STRING',
      required: false,
      choices: ["128", "96", "80", "64", "48", "32", "16"]
        .map(e=>({name:`${e}x${e}`,value:e}))
    }
  ],
    
  run({interaction}){
    const q=(interaction.options.getString('query') as string);
    const size=interaction.options.getString('size');

    let emojiData= findEmojis(interaction.client.emojis.cache,q.split("#")[0])[q];
    
    const emoji: string = size?`https://cdn.discordapp.com/emojis/${emojiData.id}.${emojiData.animated?"gif":"png"}?size=${size}`:`<${emojiData.animated?"a":""}:${emojiData.name}:${emojiData.id}>`;

    if(emoji)interaction.reply(`${emoji}`);
    else interaction.reply({
      content: "Your Specified emoji not Found!",
      ephemeral: true,
    })
  },

  autocompleteRun({interaction}){
    const q=interaction.options.getString('query') as string;

    const options =Object.keys(findEmojis(
      interaction.client.emojis.cache,q)
    ).map(e=>({name:e,value:e}));
    interaction.respond(options).catch(()=>{});
  }
}


type SearchedEmoji = {
  [key:string]:{
    name:string,
    id:string,
    animated:boolean
  }
};

// Emoji search Function
function findEmojis(emoji:Collection<string,GuildEmoji>,q:string):SearchedEmoji{
  let emojis = emoji.filter(f=>new RegExp(`^${q}$`,'i').test(`${f.name}`));
  if(!emojis.size)emojis = emoji.filter(f=>new RegExp(`^${q}`,'i').test(`${f.name}`));
  if(!emojis.size)emojis = emoji.filter(f=>new RegExp(q,'i').test(`${f.name}`));

  const result:SearchedEmoji = {};
  for(let [_,e] of emojis){
    if(Object.keys(result).length>24)return result;
    if(!e.name)continue;
    if(!(e.name in result)){
      result[`${e.name}`] = {
        name: e.name,
        id: e.id,
        animated: e.animated||false
      };
      continue;
    }
    for(let i=1;i<25;i++){
      if(!(`${e.name}#${i}` in result)){
        result[`${e.name}#${i}`] = {
          name: e.name,
          id: e.id,
          animated: e.animated||false
        };
        break;
      }
    };
  }
  return result;
}
