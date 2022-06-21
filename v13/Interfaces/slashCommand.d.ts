import {
  Interaction,
  AutocompleteInteraction,
  CommandInteraction,
  UserContextMenuInteraction,
  MessageContextMenuInteraction,
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
  PermissionResolvable,
} from 'discord.js';
import { ExtendInteraction } from 'Interfaces';

import Client from '../client';

export type ExtendInteraction<I = Interaction> = { client: Client } & I;

type RunOptions<I> = {
  client: Client;
  interaction: ExtendInteraction<I>;
};

type RunFunction<I> = (Options: RunOptions<I>) => any;

type SlashCommandType<C extends ApplicationCommandData> = {
  userPermissions?: PermissionResolvable[];

  run: C extends ChatInputApplicationCommandData
    ? RunFunction<CommandInteraction>
    : C extends UserApplicationCommandData
    ? RunFunction<UserContextMenuInteraction>
    : C extends MessageApplicationCommandData
    ? RunFunction<MessageContextMenuInteraction>
    : never;

  autocompleteRun?: C extends ChatInputApplicationCommandData
    ? RunFunction<AutocompleteInteraction>
    : never;
  // cooldown ?: number;
} & C;

export type SlashCommand =
  | SlashCommandType<ChatInputApplicationCommandData>
  | SlashCommandType<UserApplicationCommandData>
  | SlashCommandType<MessageApplicationCommandData>;
