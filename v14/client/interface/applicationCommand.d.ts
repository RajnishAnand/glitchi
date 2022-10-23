import {
  Interaction,
  AutocompleteInteraction,
  CommandInteraction,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
  PermissionResolvable,
} from 'discord.js';

import Client from '..';

export type ExtendInteraction<I = Interaction> = { client: Client } & I;

type RunOptions<I> = {
  client: Client;
  interaction: ExtendInteraction<I>;
};

type RunFunction<I> = (Options: RunOptions<I>) => any;

type ApplicationCommandType<C extends ApplicationCommandData> = {
  userPermissions?: PermissionResolvable[];

  run: C extends ChatInputApplicationCommandData
    ? RunFunction<CommandInteraction>
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
