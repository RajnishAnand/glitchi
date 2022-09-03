import { Event, ExtendMessage } from '../Interfaces';
import { messageHandler, attachDeletable } from '#libs';

export const event: Event = {
  name: 'messageCreate',

  async execute(client, msg: ExtendMessage) {
    let val = await messageHandler(client, msg);

    if (!val) return;
    if ('error' in val)
      return msg
        .reply({
          embeds: [
            {
              description: val.message,
              color: '#fcc300',
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
