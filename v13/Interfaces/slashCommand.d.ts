import {
    AutocompleteInteraction,
  ChatInputApplicationCommandData,
  CommandInteraction, 
  PermissionResolvable
} from 'discord.js';
import Client from "../client";


interface RunOptions<K>{
  client: Client;
  interaction: K;
}

type RunFunction<K> = (Options : RunOptions<K>)=>any;

export type SlashCommand = {
  userPermissions ?: PermissionResolvable[];
  run : RunFunction<CommandInteraction>;
  autocompleteRun?: RunFunction<AutocompleteInteraction>
  // cooldown ?: number;
} & ChatInputApplicationCommandData
