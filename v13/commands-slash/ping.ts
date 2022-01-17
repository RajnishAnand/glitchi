//import { SlashCommandBuilder } from '@discordjs/builders';
import {SlashCommand} from 'Interfaces';

export const command : SlashCommand = {
  name : "ping",
  description : "ping pong!",
 // data : new SlashCommandBuilder()
 //   .setName('ping')
 //   .setDescription('ping pong!')
 //   .toJSON(),
  
  run({interaction}){
     interaction.reply({content:'ping pong!', ephemeral:true})
   }
}
