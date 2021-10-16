import { CommandInteraction, Emoji } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import mdnApi from '../APIs/mdn';
import pageView from '../libs/pagination';

export default{
  data : new SlashCommandBuilder()
    .setName('mdn')
    .setDescription('search from mdn docs.')
    .addStringOption((opt)=>
      opt.setName('query')
        .setDescription('text to query for :')
        .setRequired(true))
    .toJSON(),
    
  run(interaction:CommandInteraction){
    const q=interaction.options.getString('query') as string;
    let search = mdnApi(q)
      .then(results=>{
        new pageView(interaction, results);
      }).catch(()=>{
        interaction.reply({
          content:global.config.emojis.sad+' Any relevant search result not found!',
          ephemeral:true
        });
    });
  }
}
