import { owoify } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'owoify',
  description: 'convert to text to owoLang',
  aliases: ['owo'],
  args: true,
  examples: ['hello'],

  run({ client, msg, commandName }) {
    msg.reply(
      owoify(
        msg.cleanContent
          .slice(client.config.prefix.length)
          .trim()
          .replace(commandName + ' ', ''),
      ),
    );
  },
};
