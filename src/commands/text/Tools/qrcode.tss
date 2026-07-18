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
    const url = `https://qrcode.tec-it.com/API/QRCode?data=${encodeURIComponent(content())}&color=%23d3d6fd&backcolor=%232b2d31&size=small`;
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
