import {
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
  MessageComponentInteraction,
  MessageEditOptions,
  SelectMenuInteraction,
} from 'discord.js';
import { basePagination } from './basePagination';
import EmbedHandler from './handlers/embed';
import StringHandler, { StringHandlerOptions } from './handlers/string';

export class objectPagination extends basePagination {
  declare handlers: (StringHandler | EmbedHandler)[];
  declare details: detailsOptions[];
  declare refMsg: Message | CommandInteraction;
  declare msg: Message;
  declare filter: (i: MessageComponentInteraction) => boolean;

  handlerIndex = 0;

  constructor(
    refMsg: Message | CommandInteraction,
    data: ObjectPaginationData,
    options?: ObjectPaginationOption,
  ) {
    super();

    this.handlers = [];
    this.details = [];
    this.refMsg = refMsg;

    data.forEach((e) => {
      if ('text' in e) this.handlers.push(new StringHandler(e.text, e.options));
      else this.handlers.push(new EmbedHandler(e.embeds));
      this.details.push({
        title: e.title,
        description: e.description,
        emoji: e.emoji,
      });
    });

    const userSnowflake =
      this.refMsg instanceof Message
        ? this.refMsg.author.id
        : this.refMsg.user.id;
    this.filter = options?.filter || ((i) => i.user.id == userSnowflake);

    (this.refMsg instanceof Message
      ? this.refMsg.channel.send(this.value)
      : this.refMsg.reply({ ...this.value, fetchReply: true })
    ).then((m) => {
      if (m instanceof Message) this.msg = m;
      this.init();
    });
  }

  get handler() {
    return this.handlers[this.handlerIndex];
  }
  get value() {
    if (this.handler instanceof EmbedHandler)
      return {
        content: '',
        embeds: this.handler.value,
        components: this.objectComponents(),
      };
    else
      return {
        embeds: [],
        content: this.handler.value,
        components: this.objectComponents(),
      };
  }

  // initialisation
  async init() {
    if (!this.msg) return;

    // button interaction collector
    const collector = this.msg.createMessageComponentCollector({
      idle: 120000,
      dispose: true,
    });

    // movement
    collector.on(
      'collect',
      async (interaction: MessageComponentInteraction) => {
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
            this.delete().catch(() => {});
            break;
          case 'select':
            this.handlerIndex = +(interaction as SelectMenuInteraction)
              .values[0];
            break;
        }
        interaction.update(this.value).catch(() => {});
      },
    );

    // disable components when idle
    collector.on('end', () => {
      this.msg
        .edit({ components: this.objectComponents(true) })
        .catch(() => {});
    });
  }

  objectComponents(disabled?: boolean): MessageEditOptions['components'] {
    const baseComponents = this.components(disabled) ?? [];
    return [
      ...baseComponents,
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.SelectMenu,
            customId: 'select',
            disabled,
            options: this.details.map((t, i) => ({
              label: t.title,
              value: i.toString(),
              description: t.description,
              emoji: t.emoji,
              default: i == this.handlerIndex,
            })),
          },
        ],
      },
    ];
  }
}

export type ObjectPaginationData = ((
  | {
      text: string;
      options?: StringHandlerOptions;
    }
  | {
      embeds: EmbedBuilder[];
    }
) &
  detailsOptions)[];

type detailsOptions = {
  title: string;
  description?: string;
  emoji?: string;
};

interface ObjectPaginationOption {
  filter: () => boolean;
}
