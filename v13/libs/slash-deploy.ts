import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, Snowflake} from 'discord.js';

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN as string);

export default async function deploy (
  clientId:Snowflake,
  guildId:Snowflake,
  body: Array<any>,
  ){
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    {body}
  );
  console.log('Slash registered in guild : '+guildId);
  return 200;
};
