import {SlashCommand} from 'Interfaces';
import {Collection, GuildEmoji} from 'discord.js';

export const command : SlashCommand= {
  name : 'e',
  description : 'sends emoji for you!',
  options : [{
    name : 'query',
    description : 'emoji name to query',
    type : 'STRING',
    required : true,
    autocomplete: true,
  }],
    
  run({interaction}){
    const q=(interaction.options.getString('query') as string);
    let emoji: string|undefined = findEmojis(interaction.client.emojis.cache,q.split("#")[0])[q];

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


type SearchedEmoji = {[key:string]:string};

// Emoji search Function
function findEmojis(emoji:Collection<string,GuildEmoji>,q:string):SearchedEmoji{
  let emojis = emoji.filter(f=>new RegExp(`^${q}$`,'i').test(`${f.name}`));
  if(!emojis.size)emojis = emoji.filter(f=>new RegExp(`^${q}`,'i').test(`${f.name}`));
  if(!emojis.size)emojis = emoji.filter(f=>new RegExp(q,'i').test(`${f.name}`));

  const result:SearchedEmoji = {};
  for(let [_,e] of emojis){

    if(Object.keys(result).length>24)return result;
    if(!(`${e.name}` in result)){
      result[`${e.name}`] = e.url;
      continue;
    }
    for(let i=1;i<25;i++){
      if(!(`${e.name}#${i}` in result)){
        result[`${e.name}#${i}`] = e.url;
        break;
      }
    };
  }
  return result;
}
