import Client from '../client';
import {Message, PermissionResolvable} from 'discord.js';

export interface ExtendMessage extends Message {
  client : Client;
} 

export interface CommandArgument{
  //client : Client;
  msg: ExtendMessage;
  args: string[];
  content: ()=>string;
  commandName: string;
  // error?: (message: message, err: { message: string }) => null;
}


export interface Command {
  name: string;
  
  description ? : string;
  aliases ? : string[];
  usage ? : string;
  examples ?: string[];
  
  args ? : boolean;
  userPerms ? : PermissionResolvable[];
  requiredPerms ? : PermissionResolvable[];
  category ?: string;
  
  devOnly ? : boolean;
  run : (arg:CommandArgument) => any;
}
