import npmSearch from '../APIs/npm';
import pageView from '../libs/pagination';
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

  //data : new SlashCommandBuilder()
  //  .setName('npm')
  //  .setDescription('Search for npm packages.')
  //  .addStringOption(query=>
  //    query.setName('query')
  //      .setDescription('text you wanna query for :')
  //      .setRequired(true))
  //  .toJSON(),
    
  run({client,interaction}){
    const p = interaction.options.getString('query') as string;
    npmSearch(p)
      .then(results=>{
        new pageView(interaction, results)
      }).catch(()=>{
        interaction.reply({ 
          content:client.config.emojis.sad+' Any relevant search result not found!',
          ephemeral:true
        });
      });
  }
}
