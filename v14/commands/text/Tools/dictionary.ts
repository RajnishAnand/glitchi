import { dictionary } from '#api/@dictionary';
import { embedPagination } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'dictionary',
  aliases: ['whats', 'define', 'word'],
  description: 'get defination of a word',
  args: true,
  argsHelp: ['<word>'],
  examples: ['soul', 'endanger', 'word'],

  async run({ msg, content }) {
    dictionary(content())
      .then((response) => new embedPagination(msg, response.embed()))
      .catch(() => msg.reply('ERR: Failed to fetch requested defination.'));
  },
};
