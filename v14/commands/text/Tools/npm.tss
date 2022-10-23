import { embedPagination } from '#libs';
import npmSearch from '#api/npm.js';
import { Command } from 'Interfaces';

export const command: Command = {
  name: 'npm',
  description: 'search for npm packages',
  usage: '...<query>',
  args: true,
  examples: ['react', 'discord.js'],
  run({ msg, content }) {
    npmSearch(content())
      .then((t) => new embedPagination(msg, t))
      .catch(() =>
        msg.reply(
          msg.client.config.emojis.sad +
            ' Any relevant search result not found!',
        ),
      );
  },
};
