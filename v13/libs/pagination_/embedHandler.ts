import { MessageEmbed } from 'discord.js';

export class embedHandler {
  public page = 1;
  public length: number;
  private chunks: MessageEmbed[];
  constructor(chunks: MessageEmbed[]) {
    this.length = chunks.length;
    this.chunks = chunks.map((e, i) => {
      const embed = new MessageEmbed(e);
      if (chunks.length > 1)
        embed.setFooter({
          text: `Page : ${i + 1}/${chunks.length}`,
        });
      return embed;
    });
  }

  get value() {
    return { embeds: [this.chunks[this.page - 1]] };
  }
}
