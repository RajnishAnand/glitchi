import {SlashCommand} from 'Interfaces';
import mdnApi from '../APIs/mdn';
import {pageView} from '#libs';

export const command : SlashCommand = {
  name: 'mdn',
  description: 'Search from mdn docs',
  options: [{
    name: 'query',
    description: 'text to query for :',
    type : 'STRING',
    required : true,
  }],
    
  run({client, interaction}){
    const q=interaction.options.getString('query') as string;
    mdnApi(q)
      .then(results=>{
        new pageView(interaction, results);
      }).catch(()=>{
        interaction.reply({
          content: client.config.emojis.sad+' Any relevant search result not found!',
          ephemeral:true
        });
    });
  }
}
