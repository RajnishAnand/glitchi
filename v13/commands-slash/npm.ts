import { CommandInteraction, Emoji } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import npmSearch from '../APIs/npm';
import pageView from '../libs/pagination';

export default{
  data : new SlashCommandBuilder()
    .setName('npm')
    .setDescription('Search for npm packages.')
    .addStringOption(query=>
      query.setName('query')
        .setDescription('text you wanna query for :')
        .setRequired(true))
    .toJSON(),
    
  run(interaction:CommandInteraction){
    const p = interaction.options.getString('query') as string;
    let search = npmSearch(p)
      .then(results=>{
        new pageView(interaction, results)
      }).catch(()=>{
        interaction.reply({ 
          content:global.config.emojis.sad+' Any relevant search result not found!',
          ephemeral:true
        });
      });
  }
}
