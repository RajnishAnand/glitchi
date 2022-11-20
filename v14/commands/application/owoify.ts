import { owoify } from '#libs';
import { ApplicationCommand } from 'client/interface';
import { ApplicationCommandOptionType } from 'discord.js';

export const command: ApplicationCommand = {
  name: 'owoify',
  description: 'owoify your text',
  global: false,
  options: [
    {
      name: 'text',
      description: 'Text to owoify',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run({ interaction }) {
    const txt = interaction.options.getString('text') as string;
    interaction.reply({
      content: owoify(txt),
    });
  },
};
