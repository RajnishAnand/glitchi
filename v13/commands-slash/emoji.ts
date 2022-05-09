import {SlashCommand} from 'Interfaces';

export const command : SlashCommand= {
  name : 'em',
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

    let emojiData= interaction.client.searchEmoji(q.split("#")[0])[q];
    
    if(!emojiData)return interaction.reply({
      content: "Used an unknown emoji.",
      ephemeral: true
    });

    const emoji: string = size?`${emojiData.url}?size=${size}`: emojiData.toString();

    if(emoji)interaction.reply(`${emoji}`);
    else interaction.reply({
      content: "Your Specified emoji not Found!",
      ephemeral: true,
    })
  },

  autocompleteRun({interaction}){
    const q=interaction.options.getString('query') as string;

    const options =Object.keys(interaction.client.searchEmoji(q)).map(e=>({name:e,value:e}));
    interaction.respond(options).catch(()=>{});
  }
}

