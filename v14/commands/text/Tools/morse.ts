import { attachDeletable, stringPagination } from '#libs';
import { TextCommand } from 'client/interface';
import morseNode from 'morse-node';

const morse = morseNode.create('ITU');

export const command: TextCommand = {
  name: 'morse',
  description: 'a morse convertor',
  args: true,
  argsHelp: ['?<encode||decode>', '...<text>'],
  examples: ['encode', 'decode'],

  async run({ msg, args, content, ref }) {
    let text: string;

    if (
      args[0].toLowerCase() == 'en' ||
      args[0].toLowerCase() == 'de' ||
      args[0].toLowerCase() == 'decode' ||
      args[0].toLowerCase() == 'encode'
    )
      text = content().replace(args[0].toLowerCase(), '');
    else text = content();

    if (text == '') text = (await ref().then((m) => m?.content)) ?? '';
    if (text == '')
      return msg
        .reply('You probably forgot to add text you want to encode/decode.')
        .then((m) => attachDeletable(m, msg.author.id));

    if (args[0].toLowerCase() == 'decode' || args[0].toLowerCase() == 'de') {
      text = text.replaceAll('\n', '\n ');
      new stringPagination(msg, morse.decode(text));
    } else
      new stringPagination(msg, morse.encode(text), {
        decoration: { lang: 'morse', title: 'MORSE [ITU Standard]' },
      });
  },
};
