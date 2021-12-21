import fs from 'fs';
import {slashCmnds} from '#types/slash';
import { Collection } from 'discord.js';

const slashCommands = new Collection();
const cmndFiles = fs
  .readdirSync(__dirname+'/../commands-slash')
  .filter(file => file.endsWith('.js'));

for (const file of cmndFiles){
  const cmnd=require(__dirname+'/../commands-slash/'+file)
    .default;
  slashCommands.set(cmnd.data.name,cmnd);
}
export default (slashCommands as Collection<string,slashCmnds>);
