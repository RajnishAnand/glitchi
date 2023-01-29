import { toBeegoLang } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'beegolang',
  description: 'convert to text to BeegoLang',
  aliases: ['beeg'],
  args: true,
  roleAccess: 'betaTesters',
  examples: ['politics'],

  run({ msg, content }) {
    msg.reply(toBeegoLang(content()),);
  },
};
