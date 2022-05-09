import {
    AutocompleteInteraction,
  ChatInputApplicationCommandData,
  CommandInteraction, 
  Interaction, 
  PermissionResolvable
} from 'discord.js';
import Client from "../client";


export interface ExtendInteraction extends Interaction {  client: Client}

interface ExtendCommandInteraction extends CommandInteraction {client : Client }

interface ExtendAutocompleteInteraction extends AutocompleteInteraction {client: Cluent}

interface RunOptions<K>{
  client: Client;
  interaction: K;
}

type RunFunction<K> = (Options : RunOptions<K>)=>any;

export type SlashCommand = {
  userPermissions ?: PermissionResolvable[];
  run : RunFunction<ExtendCommandInteraction>;
  autocompleteRun?: RunFunction<ExtendAutocompleteInteraction>
  // cooldown ?: number;
} & ChatInputApplicationCommandData
