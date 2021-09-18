import { Client, Intents } from 'discord.js';
import eventHandler from './libs/event-handler';
const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

//Handlers
eventHandler(client);

client.login(process.env.TOKEN);