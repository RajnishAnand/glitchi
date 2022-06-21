import { Event, ExtendMessage } from 'Interfaces';

export const event: Event = {
  name: 'messageUpdate',
  execute(client, oldMsg: ExtendMessage, msg: ExtendMessage) {
    if (oldMsg.content == msg.content) return;
    const last = oldMsg.editedTimestamp || oldMsg.createdTimestamp;
    const current = msg.editedTimestamp ?? 0;

    if (current - last < 60000)
      client.events.get('messageCreate')?.execute(client, msg);
  },
};
