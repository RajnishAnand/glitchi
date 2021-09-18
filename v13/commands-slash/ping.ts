import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data : new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping pong!')
    .toJSON(),
  
  run(interaction:CommandInteraction){
     interaction.reply({content:'ping pong!', ephemeral:true})
   }
}