import {Interaction} from 'discord.js';
import {Event} from '../Interfaces';

export const event : Event =  {
  name : 'interactionCreate',
  execute(client,interaction:Interaction){
    if(!interaction.isCommand()) return;

    const cmnd = client.slashCommands.get(interaction.commandName);
    if(!(cmnd && client.user && interaction.guildId)){
      return;
    };
    cmnd.run({client, interaction});
  }
}
