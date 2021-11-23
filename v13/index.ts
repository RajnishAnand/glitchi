import { Client, Intents } from 'discord.js';
import eventHandler from '#libs/event-handler.js';
const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
    ]
});

//Handlers
eventHandler(client);

client.login(process.env.TOKEN);