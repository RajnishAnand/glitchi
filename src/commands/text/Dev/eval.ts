import util from 'util';
import { Stopwatch, createStringPagination } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'eval',
  aliases: ['ev', '>'],
  description: 'Evaluate',
  ownerOnly: true,
  args: true,
  argsHelp: ['...<code>'],

  run({ client, msg, content, ref }) {
    const stopwatch = new Stopwatch();
    try {
      if (
        msg.author.id ===
        msg.client.guilds.cache.get(client.config.guildId)?.ownerId
      ) {
        const client = msg.client;
        const fetchRef = ref;
        const send = (text: string, bool: boolean = false) => {
          if (bool) createStringPagination(msg, text);
          else
            createStringPagination(msg, debug(text), {
              decoration: {
                codeblock: true,
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
