import {
  Message,
  Guild,
  Client,
  TextBasedChannel
} from 'discord.js';


// if (Message.guild){
  

export interface argumentObjectType {
  msg: Message;
  args: string[];
  content: ()=>string;
  commandName: string;
  error?: (message: message, err: { message: string }) => null;
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
  run :(a:argumentObjectType)=>null;
}