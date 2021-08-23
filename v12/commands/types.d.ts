import {
  Message,
  Guild,
  Client,
  TextBasedChannel
} from 'discord.js';

export interface message extends Message {
  guild: Guild;
  client: Client;
  channel: TextBasedChannel;
}

export interface argumentObjectType {
  msg: message;
  args: string[];
  content: string;
  cleanContent:string;
  commandName: string;
  error: (message: message, err: { message: string }) => null;
}

export interface commandTemplate {
  name: string;
  description ? : string;
  aliases ? : string[];
  usage ? : string;
  args ? : true;
  permissions ? : PermissionResolvable[];
  devOnly ? : boolean;
  examples: string[];
  run :class;
}