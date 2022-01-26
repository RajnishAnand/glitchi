import {
  ChatInputApplicationCommandData,
  CommandInteraction, 
  CommandInteractionOptionResolver, 
  PermissionResolvable
} from 'discord.js';
import Client from "../client";


interface RunOptions{
  client: Client;
  interaction: CommandInteraction;
}

type RunFunction = (Options : RunOptions)=>any;

export type SlashCommand = {
  userPermissions ?: PermissionResolvable[];
  run : RunFunction;
  // cooldown ?: number;
} & ChatInputApplicationCommandData
