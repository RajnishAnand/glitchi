import { embedPagination } from '#libs';
import npmSearch from '#api/npm.js';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'npm',
  description: 'search for npm packages',
  args: true,
  argsHelp: ['...<query>'],
  examples: ['react', 'discord.js'],

  run({ client, msg, content }) {
    npmSearch(content())
      .then((t) => new embedPagination(msg, t))
      .catch(() =>
        msg.reply(
          client.config.emojis.sad + ' Any relevant search result not found!',
        ),
      );
  },
};
