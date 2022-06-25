import { MessageAttachment } from 'discord.js';
import { Command } from 'Interfaces';

export const command: Command = {
  name: 'qrcode',
  aliases: ['qr'],
  description: 'QR code Generator',
  args: true,
  usage: '<text...>',
  examples: ['Hello World!'],
  roleAccess: 'betaTesters',

  run({ msg, content }) {
    const url = `https://chart.googleapis.com/chart?chs=512x512&cht=qr&choe=UTF-8&chld=l|0&chl=${encodeURIComponent(
      content(),
    )}`;
    msg
      .reply({
        files: [new MessageAttachment(url, 'QRCode.png')],
        allowedMentions: { repliedUser: false },
      })
      .catch(() => {
        msg.reply('Unknown Error!');
      });
  },
};
