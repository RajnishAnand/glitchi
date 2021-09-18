import slashCommands from '../libs/slash-handler';
import {Interaction,Client} from 'discord.js';
import {slashCmnds} from '../typings';
import slashDeploy from '../libs/slash-deploy';

export default {
  name : 'interactionCreate',
  execute(interaction:Interaction,client:Client){
    if(!interaction.isCommand()) return;
    
    const cmnd =( slashCommands
      .get(interaction.commandName) as slashCmnds);
    if((!cmnd)&&client.user && interaction.guildId){ 
      // slashDeploy(client.user.id,interaction.guildId,slashCommands);
      // interaction.reply({content:'Slash command not Found!', ephemeral:true})
      return;
    };
    cmnd.run(interaction);
  }
}
