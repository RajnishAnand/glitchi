import npmSearch from '#api/npm.js';
import { embedPagination } from '#libs';
import { ApplicationCommand } from 'client/interface';
import { ApplicationCommandOptionType } from 'discord.js';

export const command: ApplicationCommand = {
  name: 'npm',
  description: 'Search for npm packages.',
  global: true,
  options: [
    {
      name: 'query',
      description: 'text you wanna query for :',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run({ client, interaction }) {
    const p = interaction.options.getString('query') as string;
    npmSearch(p)
      .then((results) => {
        new embedPagination(interaction, results);
      })
      .catch(() => {
        interaction.reply({
          content:
            client.config.emojis.sad + ' Any relevant search result not found!',
          ephemeral: true,
        });
      });
  },
};
