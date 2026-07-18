import { EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageComponentInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { Pagination, PaginationOptions, PaginationView } from './pagination';
import EmbedHandler from './handlers/embed';
import StringHandler, { StringHandlerOptions } from './handlers/string';
import MixedHandler from './handlers/mixed';
import { PagePayload } from './handlers/provider';

export { Pagination, PaginationOptions, PaginationView };
export { StringHandler, EmbedHandler, MixedHandler };
export { PagePayload };

type RefMsg =
  | Message
  | CommandInteraction
  | UserContextMenuCommandInteraction
  | MessageContextMenuCommandInteraction;

export function createStringPagination(
  refMsg: RefMsg,
  text: string,
  options?: PaginationOptions & StringHandlerOptions,
) {
  return new Pagination(refMsg, [{ provider: new StringHandler(text, options) }], options);
}

export function createEmbedPagination(
  refMsg: RefMsg,
  embeds: EmbedBuilder[],
  options?: PaginationOptions,
) {
  return new Pagination(refMsg, [{ provider: new EmbedHandler(embeds) }], options);
}

export type ObjectPaginationData = ((
  | { text: string; options?: StringHandlerOptions }
  | { embeds: EmbedBuilder[] }
  | { payload: PagePayload[] } // mixed: text+embed per page
) & {
  title: string;
  description?: string;
  emoji?: string;
})[];

export function createObjectPagination(
  refMsg: RefMsg,
  data: ObjectPaginationData,
  options?: PaginationOptions,
) {
  const views: PaginationView[] = data.map((e) => ({
    provider:
      'text' in e
        ? new StringHandler(e.text, e.options)
        : 'embeds' in e
        ? new EmbedHandler(e.embeds)
        : new MixedHandler(e.payload),
    title: e.title,
    description: e.description,
    emoji: e.emoji,
  }));
  return new Pagination(refMsg, views, options);
}
