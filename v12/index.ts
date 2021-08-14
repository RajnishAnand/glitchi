import {Client} from 'discord.js';
import './libs/server';

const client = new Client()
require('./libs/handler').default(client);

client.login(process.env.TOKEN);