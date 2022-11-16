import { embedPagination } from '#libs';
import mdnSearch from '#api/mdn.js';
import { TextCommand } from 'client/interface';

export const command: TextCommand = {
  name: 'mdn',
  description: 'search from mdn',
  argsHelp: ['...<query>'],
  args: true,
  examples: ['AJAX', 'fetch'],
  run({ client, msg, content }) {
    mdnSearch(content())
      .then(
        (t) =>
          new embedPagination(
            msg,
            t.map((k) => k.embedify()),
          ),
      )
      .catch(() =>
        msg.reply(
          client.config.emojis.sad + ' Any relevant search result not found!',
        ),
      );
  },
};
