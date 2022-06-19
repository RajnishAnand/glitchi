import npmSearch from '../APIs/npm';
import {embedPagination} from '#libs';
import {SlashCommand} from 'Interfaces';

export const command : SlashCommand = {
  name : 'npm',
  description : 'Search for npm packages.',
  options : [{
    name : 'query',
    description :'text you wanna query for :',
    type : 'STRING',
    required : true,
  }],
    
  run({client,interaction}){
    const p = interaction.options.getString('query') as string;
    npmSearch(p)
      .then(results=>{
        new embedPagination(interaction, results)
      }).catch(()=>{
        interaction.reply({ 
          content:client.config.emojis.sad+' Any relevant search result not found!',
          ephemeral:true
        });
      });
  }
}
