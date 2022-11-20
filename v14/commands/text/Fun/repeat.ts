import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'repeat',
  description: 'make glitchi repeat your text',
  aliases: ['say'],
  args: true,
  examples: ['hello', 'hi'],
  run({ client, msg, commandName }) {
    let txt = msg.cleanContent
      .substring(client.config.prefix.length)
      .replace(/^[\s+]?/, '')
      .replace(commandName + ' ', '');

    if (/@((here)|(everyone))/.test(txt))
      msg.reply(
        `${client.config.emojis.knife} Are you trying to make me ping everyone.`,
      );
    else msg.channel.send(txt);
  },
};
