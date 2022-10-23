import { Command } from 'Interfaces';

export const command: Command = {
  name: 'repeat',
  description: 'make glitchi repeat your text',
  aliases: ['say'],
  args: true,
  examples: ['hello', 'hi'],
  run({ msg, commandName }) {
    let txt = msg.cleanContent
      .substring(msg.client.config.prefix.length)
      .replace(/^[\s+]?/, '')
      .replace(commandName + ' ', '');

    if (/@((here)|(everyone))/.test(txt))
      msg.reply(
        `${msg.client.config.emojis.knife} Are you trying to make me ping everyone.`,
      );
    else msg.channel.send(txt);
  },
};
