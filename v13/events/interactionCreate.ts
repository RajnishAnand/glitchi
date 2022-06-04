import {Event, ExtendInteraction} from '../Interfaces';

export const event : Event =  {
  name : 'interactionCreate',
  execute(client,interaction:ExtendInteraction){
    if (!(
      interaction.isAutocomplete()||
      interaction.isCommand()||
      interaction.isContextMenu()
    ))return;

    const cmnd= client.slashCommands.get(interaction.commandName);
    if(!(cmnd && interaction.guildId)){
      return;
    };
    
    // AutocompleteInteraction
    if(interaction.isAutocomplete()&&cmnd.autocompleteRun&&(!interaction.responded))cmnd.autocompleteRun({client,interaction});

    // CommandInteraction 
    else if(interaction.isCommand()&&(!cmnd.type || cmnd.type=="CHAT_INPUT")&&interaction.isRepliable())cmnd.run({client,interaction});

    // UserContextMenuInteraction
    else if(interaction.isUserContextMenu()&&(cmnd.type=="USER"))cmnd.run({client,interaction});

    // MessageContextMenuInteraction
    else if(interaction.isMessageContextMenu()&&(cmnd.type=="MESSAGE"))cmnd.run({client,interaction});
  }

}
