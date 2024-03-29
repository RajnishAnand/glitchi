import dallemini from '#api/dalle-mini.js';
import { Stopwatch } from '#libs';
import { TextCommand } from 'client/interface';
import { Canvas, loadImage } from '@napi-rs/canvas';

export const command: TextCommand = {
  name: 'dallemini',
  description: 'Generate images from text',
  aliases: ['craiyon'],
  args: true,
  argsHelp: ['...<prompt>'],
  examples: ['harry potter with a sword'],
  roleAccess: 'betaTesters',
  async run({ client, msg, content }) {
    const m = await msg.reply(
      `${client.config.emojis.rollCat} Fetching...\n*it may take a while. Sit back, will ping you when its done.*`,
    );
    const stopwatch = new Stopwatch();
    stopwatch.start();

    dallemini(content())
      .then(async (imgs) => {
        msg.reply({
          allowedMentions: { repliedUser: true },
          content: `⏱️${stopwatch.stop()}s | [Generated by Craiyon]`,
          files: [await imageToGrid(imgs)],
        });
      })
      .then(() => m.delete().catch(() => {}))
      .catch(() => {
        m.edit('Failed to fetch.');
      });
  },
};

async function imageToGrid(images: string[] | Buffer[]) {
  const canvas = new Canvas(620, 620);
  const ctx = canvas.getContext('2d');

  for (let i = 0, n = 0; i < 3; i++)
    for (let ii = 0; ii < 3; ii++, n++) {
      let img = await loadImage(images[n]);
      ctx.drawImage(img, i * 205 + 5, ii * 205 + 5, 200, 200);
    }

  return await canvas.toBuffer('image/png');
}
