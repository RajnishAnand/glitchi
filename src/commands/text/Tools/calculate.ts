import { inspect } from 'util';
import { compile } from 'mathjs';
import { Stopwatch, createStringPagination } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'calculate',
  aliases: ['calc'],
  description: 'a calculator',
  args: true,
  argsHelp: ['<...text>'],

  async run({ msg, content }) {
    const stopwatch = new Stopwatch();

    try {
      stopwatch.start();
      const txt = compile(content()).evaluate();
      stopwatch.stop();

      createStringPagination(msg, inspect(txt, { depth: 10 }), {
        split: { with: ',' },
        decoration: {
          lang: 'js',
          title: 'MATH.JS',
          secondaryTitle: `⏱ ${stopwatch.elapsed}s`,
        },
      });
    } catch (err: any) {
      createStringPagination(msg, err.message ?? ' ', {
        decoration: {
          lang: 'js',
          title: 'MATH.JS[ERROR]',
        },
      });
    }
  },
};
