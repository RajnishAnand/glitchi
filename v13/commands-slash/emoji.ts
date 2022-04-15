import {SlashCommand} from 'Interfaces';

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
  },

  autocompleteRun({interaction}){
    const q=interaction.options.getString('query') as string;

    let emojiArray = interaction.client.emojis.cache.filter(f=> new RegExp(`^${q}$`,'i').test(f.name||''));
    if(!emojiArray.size)emojiArray = interaction.client.emojis.cache.filter(f=>new RegExp(`^${q}`,'i').test(f.name||''));
    if(!emojiArray.size)emojiArray = interaction.client.emojis.cache.filter(f=>new RegExp(q,'i').test(f.name||''));

    const options = emojiArray.map(e=>({
      name: `${e.name}`,
      value: `${e.name}`
    })).slice(0,25);

    if(options.length)interaction.respond(options);
  }
}
