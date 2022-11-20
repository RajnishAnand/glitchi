import {
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
  MessageComponentInteraction,
} from 'discord.js';
import { basePagination } from './basePagination';
import EmbedHandler from './handlers/embed';

export class embedPagination extends basePagination {
  declare handler: EmbedHandler;
  declare refMsg: Message | CommandInteraction;
  declare msg: Message;
  declare filter: (i: MessageComponentInteraction) => boolean;

  constructor(
    refMsg: Message | CommandInteraction,
    embeds: EmbedBuilder[],
    options?: EmbedPaginationOption,
  ) {
    super();
    this.refMsg = refMsg;

    this.handler = new EmbedHandler(embeds);

    const userSnowflake =
      this.refMsg instanceof Message
        ? this.refMsg.author.id
        : this.refMsg.user.id;

    this.filter = options?.filter || ((i) => i.user.id == userSnowflake);
    if (options?.initialPage) this.page = options.initialPage;

    // message initialize
    (this.refMsg instanceof Message
      ? this.refMsg.channel.send(this.value)
      : this.refMsg.reply({
          ...this.value,
          ephemeral: options?.ephemeral,
          fetchReply: true,
        })
    ).then((m) => {
      if (m instanceof Message) this.msg = m;
      this.init();
    });
  }

  get value() {
    return {
      embeds: this.handler.value,
      components: this.components(),
    };
  }

  // initialisation
  async init() {
    if (!this.msg) return;

    const collector = this.msg.createMessageComponentCollector({
      idle: 120000,
      componentType: ComponentType.Button,
      dispose: true,
    });

    // navigation
    collector.on('collect', async (interaction) => {
      if (!this.filter(interaction)) {
        interaction.reply({
          ephemeral: true,
          content: this.invalidClickWarning,
        });
        return;
      }

      switch (interaction.customId) {
        case 'left':
          this.page--;
          break;
        case 'right':
          this.page++;
          break;
        case 'page':
          this.goto(interaction);
          break;
        case 'delete':
          await this.delete().catch(() => {});
          break;
      }
      interaction.update(this.value).catch(() => {});
    });

    // disable components when idle
    collector.on('end', () => {
      this.msg.edit({ components: this.components(true) }).catch(() => {});
    });
  }
}

interface EmbedPaginationOption {
  filter: () => boolean;
  initialPage: number;
  ephemeral?: boolean;
}
