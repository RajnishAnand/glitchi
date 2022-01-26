import {SlashCommand} from 'Interfaces';

export const command : SlashCommand= {
  name : 'emoji',
  description : 'sends emoji for you!',
  options : [{
    name : 'query',
    description : 'emoji name to query',
    type : 'STRING',
    required : true
  }],
    
  run({interaction}){
    const q=interaction.options.getString('query') as string;
    let e = interaction.client.emojis.cache.find(f=> 
      new RegExp(`^${q}$`,'i').test(f.name||''));
    if(!e) e = interaction.client.emojis.cache.find(f=>
      new RegExp(`^${q}`,'i').test(f.name||''));
    if(!e) e = interaction.client.emojis.cache.find(f=>
      new RegExp(q,'i').test(f.name||''));
    if(!e) return interaction.reply({
      content : 'Your specified emoji not found!',
      ephemeral : true
    })
    interaction.reply(e.toString());
  }
}
