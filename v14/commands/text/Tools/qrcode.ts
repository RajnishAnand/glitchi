import { TextCommand } from 'client/interface';
import { AttachmentBuilder } from 'discord.js';

export const command: TextCommand = {
  name: 'qrcode',
  aliases: ['qr'],
  description: 'QR code Generator',
  args: true,
  argsHelp: ['<text...>'],
  examples: ['Hello World!'],
  roleAccess: 'betaTesters',

  run({ msg, content }) {
    const url = `https://chart.googleapis.com/chart?chs=512x512&cht=qr&choe=UTF-8&chld=l|0&chl=${encodeURIComponent(
      content(),
    )}`;
    msg
      .reply({
        files: [new AttachmentBuilder(url, { name: 'QRCode.png' })],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => {
        msg.reply('Unknown Error!');
      });
  },
};
