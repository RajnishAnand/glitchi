import fs from 'fs';
import {Client} from 'discord.js';

const eventFiles = fs.readdirSync(__dirname+'/../events')
  .filter(f=>f.endsWith('.js'));

export default async function (client : Client){
  for (const files of eventFiles){
    const event = require(__dirname+'/../events/'+files)
      .default;
    if (event.once) client.once(event.name,(...args)=>
      event.execute(...args));
    else client.on(event.name,(...args)=>
      event.execute(...args,client));
  }
}