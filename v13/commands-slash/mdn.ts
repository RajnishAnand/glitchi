import {SlashCommand} from 'Interfaces';
import mdnApi,{mdnEmbedify} from '../APIs/mdn';

export const command : SlashCommand = {
  name: 'mdnn',
  description: 'Search from mdn docs',
  options: [{
    name: 'query',
    description: 'text to query for :',
    type : 'STRING',
    required : true,
    autocomplete: true,
  }],
    
  run({client, interaction}){
    const q=interaction.options.getString('query') as string;
    mdnApi(q)
      .then(response=>{
        interaction.reply({
          embeds: [mdnEmbedify(response[0])],
          components: [{
            type:"ACTION_ROW",
            components:[{
              type: 'BUTTON',
              style: 'LINK',
              url: response[0].mdn_url,
              label: "Open in Browser"
            }]
          }]
        })
      }).catch(()=>{
        interaction.reply({
          content: client.config.emojis.sad+' Any relevant search result not found!',
          ephemeral:true
        });
    });
  },

  async autocompleteRun({interaction}){
    const q=interaction.options.getString('query') as string;
    const resp = await mdnApi(q).then(r=>r.map(e=>({
      name: e.title,
      value: e.title
    }))).catch(()=>[]);

    interaction.respond(resp.slice(0,25))
  }
}
