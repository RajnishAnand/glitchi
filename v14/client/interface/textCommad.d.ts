import Client from '../index';
import { Message, PermissionResolvable } from 'discord.js';

export interface ExtendedMessage extends Message {
  client: Client;
}

export interface TextCommand {
  name: string;
  aliases?: string[];

  description: string;
  help?: string;

  args: boolean;
  argsRegex?: RegExp[];
  argsHelp: string[];
  examples: string[];

  userPerms?: PermissionResolvable[];
  requiredPerms?: PermissionResolvable[];
  roleAccess?: 'betaTesters';
  ownerOnly?: boolean;
  category?: string;

  run: (params: TextCommandOptions) => any;
}

export interface TextCommandOptions {
  client: Client;
  msg: Message;
  args: string[];
  commandName: string;
  ref: () => Promise<Message> | false;
  content: () => string;
}
