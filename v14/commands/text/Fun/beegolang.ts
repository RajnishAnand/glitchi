import { toBeegoLang } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'beegolang',
  description: 'convert to text to owoLang',
  aliases: ['beeg'],
  args: true,
  roleAccess: 'betaTesters',
  examples: ['hello'],

  run({ client, msg, commandName }) {
    msg.reply(
      toBeegoLang(
        msg.cleanContent
          .slice(client.config.prefix.length)
          .trim()
          .replace(commandName + ' ', ''),
      ),
    );
  },
};
