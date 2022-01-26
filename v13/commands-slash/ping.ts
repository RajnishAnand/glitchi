import {SlashCommand} from 'Interfaces';

export const command : SlashCommand = {
  name : "ping",
  description : "ping pong!",
  
  run({interaction}){
     interaction.reply({content:'ping pong!', ephemeral:true})
   }
}
