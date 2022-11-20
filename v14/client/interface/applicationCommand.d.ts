import {
  Interaction,
  AutocompleteInteraction,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
  PermissionResolvable,
  ChatInputCommandInteraction,
} from 'discord.js';

import Client from '..';

type RunOptions<I> = {
  client: Client;
  interaction: I;
};

type RunFunction<I> = (Options: RunOptions<I>) => any;

type ApplicationCommandType<C extends ApplicationCommandData> = {
  userPermissions?: PermissionResolvable[];
  global: boolean;
  run: C extends ChatInputApplicationCommandData
    ? RunFunction<ChatInputCommandInteraction>
    : C extends UserApplicationCommandData
    ? RunFunction<UserContextMenuCommandInteraction>
    : C extends MessageApplicationCommandData
    ? RunFunction<MessageContextMenuCommandInteraction>
    : never;

  autocompleteRun?: C extends ChatInputApplicationCommandData
    ? RunFunction<AutocompleteInteraction>
    : never;
  // cooldown ?: number;
} & C;

export type ApplicationCommand =
  | ApplicationCommandType<ChatInputApplicationCommandData>
  | ApplicationCommandType<UserApplicationCommandData>
  | ApplicationCommandType<MessageApplicationCommandData>;
