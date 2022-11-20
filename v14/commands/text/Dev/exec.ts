import cp from 'child_process';
import util from 'util';
import { stringPagination } from '#libs';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'exec',
  description: 'execute command directly to bash',
  aliases: ['ex', '$'],
  args: true,
  argsHelp: ['...<code>'],
  ownerOnly: true,

  run({ client, msg, content }) {
    if (!(msg.author.id === client.config.ownerId)) return;
    cp.exec(content(), (...d) => {
      let tx = d[0] ? util.inspect(d[0]) : d[1] ? d[1] : d[2];
      new stringPagination(msg, tx, {
        decoration: { lang: 'bash', title: 'BASH-OUTPUT' },
      });
    });
  },
};
