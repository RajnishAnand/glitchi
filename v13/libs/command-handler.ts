import fs from 'fs';
import {Collection,Client} from 'discord.js';
const commands = new Collection();

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
export {commands };