import { attachDeletable, stringPagination } from '#libs';
import { CBParser } from 'cbparser';
import { TextCommand } from 'client/interface';
import { EmbedBuilder } from 'discord.js';

export const command: TextCommand = {
  name: 'embed',
  description: 'convert your json-code to Embed',
  args: true,
  argsHelp: ['...<json-Embed>'],

  run({ msg, content }) {
    let txt = content().replace(/[­ ]/g, '');
    txt = CBParser(txt)[0]?.code.replaceAll('\\`', '`') ?? txt;

    try {
      let obj = JSON.parse(txt);

      let embeds: EmbedBuilder[];
      if (Array.isArray(obj)) embeds = obj.map((e) => new EmbedBuilder(e));
      else embeds = [new EmbedBuilder(obj)];
      // if (!Array.isArray(obj))
      msg
        .reply({
          embeds,
          allowedMentions: { repliedUser: false },
        })
        .then((m) => attachDeletable(m, msg.author.id))
        .catch((e: any) => {
          const errorMessage =
            typeof e == 'string'
              ? e
              : typeof e?.message == 'string'
              ? e.message
              : 'Unknown Error';
          new stringPagination(msg, e.message, {
            decoration: { lang: 'js', title: 'EmbedError' },
          });
        });
    } catch (err: any) {
      new stringPagination(msg, err.message, {
        decoration: { lang: 'JSON_ERROR' },
      });
    }

    //msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a  **"code-block"**');
  },
};
