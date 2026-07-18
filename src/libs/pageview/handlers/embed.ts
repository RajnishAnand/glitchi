import { EmbedBuilder } from '@discordjs/builders';
import { PageProvider, PagePayload } from './provider';

export default class EmbedHandler implements PageProvider {
  public page = 1;
  public length: number;
  private chunks: EmbedBuilder[];

  constructor(embeds: EmbedBuilder[]) {
    this.length = embeds.length;
    this.chunks = embeds;
  }

  render(): PagePayload {
    return { embeds: [this.chunks[this.page - 1]] };
  }
}
