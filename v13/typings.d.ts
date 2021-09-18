import config from '../config.json';
import {Interaction} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

declare global {
  namespace NodeJS {
    interface Global {
       config
    } 
  }
}

//Slash Command interface
interface slashCmnds {
  data : SlashCommandBuilder;
  run : (interaction: Interaction)=>null;
}

export {global, slashCmnds};