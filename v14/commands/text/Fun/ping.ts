import { TextCommand } from 'client/interface';
import { Message } from 'discord.js';

export const command: TextCommand = {
  name: 'ping',
  description: 'bot latency and heartbeat',
  args: false,
  run({ client, msg }) {
    msg.channel
      .send(`pong!`)
      .then((sent: Message) =>
        sent.edit(
          `${client.config.emojis.dance} | Pong! | Heartbeat : ${
            msg.client.ws.ping
          }ms | Roundtrip latency : ${
            sent.createdTimestamp - msg.createdTimestamp
          }ms.`,
        ),
      );
  },
};
