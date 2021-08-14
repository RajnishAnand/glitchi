import fs from 'fs';
import {Collection,Client} from 'discord.js';
const commands: any = new Collection();

export default (client:Client)=>{
  //    Event Handler    //
  const eventFiles = fs.readdirSync(__dirname+'/../events').filter((file)=>file.endsWith('.js'));

  for (const file of eventFiles){
    const event = require(__dirname+`/../events/${file}`);
    if(event.once)client.once(event.name,(...args)=>
    event.execute(...args,client));
    else client.on(event.name,(...args)=>
    event.execute(...args,client));
  }
  
  //   Command Handler   //
  const commandFolders = fs.readdirSync(__dirname+'/../commands');

  for(const folder of commandFolders){
    const commandFiles = fs
    .readdirSync(__dirname+`/../commands/${folder}`)
    .filter((file)=>file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(__dirname+`/../commands/${folder}/${file}`).default;
      command.category = folder;
      commands.set(command.name, command);
    }; 
  }
}
export {commands};