import { EmbedBuilder } from '@discordjs/builders';

export default class EmbedHandler {
  public page = 1;
  public length: number;
  private chunks: EmbedBuilder[];
  constructor(chunks: EmbedBuilder[]) {
    this.length = chunks.length;
    this.chunks = chunks;
  }

  get value() {
    return [this.chunks[this.page - 1]];
  }
}
