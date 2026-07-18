import { EmbedBuilder } from '@discordjs/builders';

export interface PagePayload {
  content?: string;
  embeds?: EmbedBuilder[];
}

export interface PageProvider {
  page: number;
  readonly length: number;
  render(): PagePayload;
}
