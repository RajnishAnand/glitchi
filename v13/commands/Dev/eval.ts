import util from 'util';
import { Stopwatch, stringPagination } from '#libs';
import { Command } from 'Interfaces';

export const command: Command = {
  name: 'eval',
  aliases: ['ev'],
  description: 'Evaluate',
  devOnly: true,
  args: true,
  // usage : string,
  // permissions : string,
  // permRequired : [string],
  run({ msg, content }) {
    const stopwatch = new Stopwatch();
    try {
      if (
        msg.author.id ===
        msg.client.guilds.cache.get(msg.client.config.guildId)?.ownerId
      ) {
        const client = msg.client;
        const send = (text: string, bool: boolean = false) => {
          if (bool) new stringPagination(msg, text);
          else
            new stringPagination(msg, debug(text), {
              decoration: {
                lang: 'js',
                title: 'JS-OUTPUT',
                secondaryTitle: `⏱ ${(stopwatch.stop(), stopwatch.elapsed)}s`,
              },
              split: { with: ',' },
            });
          return '<pagination>';
        };
        stopwatch.start();
        send(eval(content()));
      } else {
        msg.channel.send(
          'You breached level 1 security, level 2 stands Guard! 🛡️',
        );
      }
    } catch (err: any) {
      msg.channel.send('```\n' + err.message + '```');
    }
  },
};

//To replace '<' & '`' character
function debug(evaled: string) {
  try {
    if (typeof evaled === 'string') {
      evaled = evaled.replace(/</g, '<​').replace(/```/g, '`​``');
    }
    return util.inspect(evaled);
  } catch (err: any) {
    return err.message;
  }
}
