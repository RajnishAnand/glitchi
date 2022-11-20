import imgQuote from '#api/imageQuote.js';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'imgquote',
  description: 'Quotes with image',
  aliases: ['insp', 'imagequote', 'inspire'],
  args: false,
  roleAccess: 'betaTesters',
  run({ client, msg }) {
    imgQuote()
      .then((t) =>
        msg.reply({
          files: [t],
          allowedMentions: { repliedUser: false },
        }),
      )
      .catch(() =>
        msg.reply(
          client.config.emojis.sad +
            ' An Unknown Error Occurred while fetching from api.',
        ),
      );
  },
};
