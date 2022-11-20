import { Event } from 'client/interface';
import { messageHandler, attachDeletable } from '#libs';
import { Message } from 'discord.js';

export const event: Event = {
  name: 'messageCreate',

  async execute(client, msg: Message) {
    let val = await messageHandler(client, msg);

    if (!val) return;
    if ('error' in val)
      return msg
        .reply({
          embeds: [
            {
              description: val.message,
              color: 0xfcc300,
              footer: {
                text: val.command?.name
                  ? val.command.name + ': ' + val.error
                  : val.error,
              },
            },
          ],
        })
        .then((m) => attachDeletable(m, msg.author.id));

    try {
      val.command.run(val.args);
    } catch (err) {
      msg.reply({
        embeds: [
          {
            title: 'Error',
            description: 'Failed to execute this command!',
            // TODO: add to error log
          },
        ],
      });
    }
  },
};
