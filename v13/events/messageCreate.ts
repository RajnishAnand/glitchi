import { Event, ExtendMessage } from '../Interfaces';
import { messageHandler } from '#libs';
import ExtendClient from 'client';

export const event: Event = {
  name: 'messageCreate',

  async execute(client, msg: ExtendMessage) {
    let val = await messageHandler(client, msg);

    if (!val) return;
    if ('error' in val)
      return msg.reply({
        embeds: [
          {
            title: `Error[${val.error}]`,
          },
        ],
      });

    try {
      val.command.run(val.args);
    } catch (err) {
      msg.reply({
        embeds: [
          {
            title: 'err',
          },
        ],
      });
    }
  },
};
