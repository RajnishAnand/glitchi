import { messageinfo, objectPagination } from '#libs';
import { ApplicationCommand } from 'client/interface';
import { ApplicationCommandType, Message } from 'discord.js';

export const command: ApplicationCommand = {
  name: 'messageinfo',
  type: ApplicationCommandType.Message,
  global: true,

  run({ interaction }) {
    try {
      new objectPagination(interaction, messageinfo(interaction.targetMessage));
    } catch (_) {}
  },
};
