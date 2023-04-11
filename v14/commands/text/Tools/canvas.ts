import { VM } from 'vm2';
// import { Canvas, Image, loadImage } from 'skia-canvas';
import { Canvas, Image, loadImage } from '@napi-rs/canvas';
import { inspect } from 'util';
import { CBParser } from 'cbparser';
import { Stopwatch, PerlinNoise, stringPagination } from '#libs';
import { TextCommand } from 'client/interface';
import { ButtonStyle, ComponentType } from 'discord.js';

export const command: TextCommand = {
  name: 'canv',
  description: 'canvas sandbox',
  aliases: ['canvas', 'draw'],
  args: true,
  argsHelp: ['<code...>'],
  // roleAccess: "betaTesters",

  async run({ client, msg, args, content }) {
    if (args[0].toLowerCase() == '--cheatsheet') {
      return msg.reply({
        embeds: [
          {
            title: 'Cheatsheet',
            color: 0x2f3136,
            url: 'http://www.cheat-sheets.org',
            description: 'Canvas Cheatsheet Preview: ',
            image: {
              url: 'http://www.cheat-sheets.org/saved-copy/HTML5_Canvas_Cheat_Sheet.png',
            },
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: 'PDF',
                url: 'https://cdn.discordapp.com/attachments/864517432026333184/864518194445287454/HTML5_Canvas_Cheat_Sheet.pdf',
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: 'PNG',
                url: 'http://www.cheat-sheets.org/saved-copy/HTML5_Canvas_Cheat_Sheet.png',
              },
            ],
          },
        ],
        allowedMentions: { repliedUser: false },
        failIfNotExists: false,
      });
    }

    const vm = new VM({
      sandbox: {},
      eval: false,
      wasm: false,
      timeout: 6000,
      fixAsync: false,
      compiler: 'javascript',
    });
    const process = {
      env: {
        TOKEN:
          'never gonna give you up never gonna let you down never gonnna turn arnound and desert you.',
      },
    };
    vm.freeze(process, 'process');
    vm.freeze(Canvas, 'Canvas');
    vm.freeze(Image, 'Image');
    vm.freeze(PerlinNoise, 'PerlinNoise');

    try {
      const stopwatch = new Stopwatch();
      let code = content();
      code = CBParser(code)[0]?.code ?? code;

      stopwatch.start();
      const matches = code.matchAll(/\!\[([A-Za-z]?\w+)\]\((.*)\)/g);

      for (let each of matches) {
        // loading image from avatar url
        if (each[2].startsWith('user#')) {
          let url: string | null | undefined;
          const str = each[2].replace('user#', '').toLowerCase();
          if (str == 'me')
            url = msg.author.avatarURL({ size: 4096, extension: 'png' });
          else if (str == 'you')
            url = client.user?.avatarURL({ size: 4096, extension: 'png' });
          else if (/^\d+$/.test(str))
            url = (await msg.client.users.fetch(str)).avatarURL({
              size: 4096,
              extension: 'png',
            });
          else throw new Error(`${each[1]}:user ->${str}<- is not a userID.`);
          if (!url)
            throw new Error(
              `${each[1]}:${each[2]}'s avatar returned null|undefined.`,
            );
          each[2] = url;
        }

        // loading image from attachments
        else if (each[2].startsWith('attachment#')) {
          const key = +each[2].replace('attachment#', '');
          if (Number.isNaN(key))
            throw new Error(`${each[1]}:${each[2]} is probably undefined.`);
          const url = msg.attachments.at(key)?.url;
          if (!url) throw new Error(`${each[1]}:${each[2]} is undefined.`);
          each[2] = url;
        }

        // loading inage from emoji
        else if (each[2].startsWith('emoji#')) {
          const key = each[2].replace('emoji#', '');
          if (/^\d+$/.test(key))
            each[2] = `https://cdn.discordapp.com/emojis/${key}.png`;
          else {
            const url = client.searchEmoji(key.split('#')[0])[key]?.url;
            if (!url)
              throw new Error(`${each[1]}:${each[2]} returned null|undefined.`);
            each[2] = url;
          }
        }

        // prevent lacal file access
        if (!/^https?:\/\/.+/.test(each[2]))
          throw new Error(`Invalid URL at ${each[1]}:${each[2]}`);

        vm.sandbox[each[1]] = await loadImage(each[2]);
      }

      const data: unknown = await vm.run(wrap(code));

      // canv as an object for Output
      if (!Buffer.isBuffer(data)) {
        let txt = inspect(data);
        const length = txt.length;
        if (length > 4000) txt = `${txt.slice(4001)}...${length - 4000} Char`;
        stopwatch.stop();

        return new stringPagination(msg, txt, {
          split: { with: ',' },
          decoration: {
            lang: 'js',
            title: 'Canvas[Output]',
            secondaryTitle: `⏱ ${stopwatch.elapsed}s`,
          },
        });
      }

      stopwatch.stop();

      await msg.reply({
        content: `⏱️${stopwatch.elapsed}s | Canvas Output: :frame_photo:`,
        files: [data],
        allowedMentions: { repliedUser: false },
        failIfNotExists: false,
      });
    } catch (e: any | Error) {
      new stringPagination(msg, e.toString?.() || inspect(e), {
        decoration: {
          lang: 'js',
          title: `Canvas[${e.name || 'Error'}]`,
        },
      });
    }
  },
};

function wrap(txt: string) {
  return `"use strict";
  (function(){
    let canvas = new Canvas(600, 600);
    ${txt}
    return canvas.toBuffer("image/png");
  })();`;
}
