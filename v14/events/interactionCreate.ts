import { Event, ExtendInteraction } from 'client/interface';
import { ApplicationCommandType, Interaction } from 'discord.js';

export const event: Event = {
  name: 'interactionCreate',
  execute(client, interaction: Interaction) {
    if (!(interaction.isAutocomplete() || interaction.isCommand())) return;

    const cmnd = client.applicationCommands.get(interaction.commandName);
    // lient.applicationCommands.get(interaction.commandName);
    if (!(cmnd && interaction.guildId)) return;

    // AutocompleteInteraction
    if (
      interaction.isAutocomplete() &&
      cmnd.autocompleteRun &&
      !interaction.responded
    )
      cmnd.autocompleteRun({ client, interaction });
    // CommandInteraction
    else if (
      interaction.isChatInputCommand() &&
      (cmnd.type == ApplicationCommandType.ChatInput ||
        cmnd.type == undefined) &&
      !interaction.replied
    )
      cmnd.run({ client, interaction });
    // UserContextMenuInteraction
    else if (
      interaction.isUserContextMenuCommand() &&
      cmnd.type == ApplicationCommandType.User
    )
      cmnd.run({ client, interaction });
    // MessageContextMenuInteraction
    else if (
      interaction.isMessageContextMenuCommand() &&
      cmnd.type == ApplicationCommandType.Message
    )
      cmnd.run({ client, interaction });
  },
};
