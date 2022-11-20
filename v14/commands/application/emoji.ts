import { ApplicationCommand } from 'client/interface';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';

export const command: ApplicationCommand = {
  name: 'e',
  description: 'sends emoji for you!',
  global: true,
  options: [
    {
      name: 'query',
      description: 'emoji name to query',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: 'size',
      description: 'raw emoji size:',
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: ['128', '96', '80', '64', '48', '32', '16'].map((e) => ({
        name: `${e}x${e}`,
        value: e,
      })),
    },
  ],

  run({ client, interaction }) {
    const q = interaction.options.getString('query') as string;
    const size = interaction.options.getString('size');

    let emojiData = client.searchEmoji(q.split('#')[0])[q];

    if (!emojiData)
      return interaction.reply({
        content: 'Used an unknown emoji.',
        ephemeral: true,
      });

    const emoji: string = size
      ? `${emojiData.url}?size=${size}`
      : emojiData.toString();

    if (emoji) interaction.reply(`${emoji}`);
    else
      interaction.reply({
        content: 'Your Specified emoji not Found!',
        ephemeral: true,
      });
  },

  autocompleteRun({ client, interaction }) {
    const q = interaction.options.getString('query') as string;

    const options = Object.keys(client.searchEmoji(q)).map((e) => ({
      name: e,
      value: e,
    }));
    interaction.respond(options).catch(() => {});
  },
};
