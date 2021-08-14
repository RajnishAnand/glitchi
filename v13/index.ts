import { Client, Intents } from 'discord.js';

const client = new Client({ 
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ] 
  });

// client.once('ready', () => {
// 	console.log('Ready!');
// });

// client.on('interactionCreate', async interaction=>{
//   console.log(interaction);
// })

client.login(process.env.TOKEN);