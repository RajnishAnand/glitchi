import ExtendClient from 'client/index';
import {
    ActionRowData,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  Message,
  MessageActionRowComponentData,
  MessageComponentInteraction,
  MessageContextMenuCommandInteraction,
  MessageCreateOptions,
  MessageEditOptions,
  StringSelectMenuInteraction,
  TextInputStyle,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { PageProvider } from './handlers/provider';

type RefMsg =
  | Message
  | CommandInteraction
  | UserContextMenuCommandInteraction
  | MessageContextMenuCommandInteraction;

export interface PaginationView {
  provider: PageProvider;
  title?: string;
  description?: string;
  emoji?: string;
}

export interface PaginationOptions {
  filter?: (i: MessageComponentInteraction) => boolean;
  initialPage?: number;
  initialView?: number;
  ephemeral?: boolean;
}

export class Pagination {
  refMsg: RefMsg;
  msg?: Message;
  filter: (i: MessageComponentInteraction) => boolean;

  private views: PaginationView[];
  private viewIndex: number;

  constructor(refMsg: RefMsg, views: PaginationView[], options?: PaginationOptions) {
    if (!views.length) throw new Error('Pagination requires at least one view.');

    this.refMsg = refMsg;
    this.views = views;
    this.viewIndex = options?.initialView ?? 0;

    const userSnowflake =
      this.refMsg instanceof Message ? this.refMsg.author.id : this.refMsg.user.id;
    this.filter = options?.filter ?? ((i) => i.user.id === userSnowflake);

    if (options?.initialPage) {
      // negative initialPage counts back from the last page (-1 = last, -2 = second-to-last)
      this.page =
        options.initialPage < 0
          ? this.length + options.initialPage + 1
          : options.initialPage;
    }

    (this.refMsg instanceof Message
      ? this.refMsg.reply(this.value)
      : this.refMsg.reply({ ...this.value, ephemeral: options?.ephemeral, fetchReply: true })
    ).then((m) => {
      if (m instanceof Message) this.msg = m;
      this.init();
    });
  }

  private get provider() {
    return this.views[this.viewIndex].provider;
  }

  get currentProvider() {
    return this.provider;
  }

  get page() {
    return this.provider.page;
  }
  set page(x: number) {
    this.provider.page = x > 0 && x < this.length + 1 ? x : this.page;
  }
  get length() {
    return this.provider.length;
  }

  get value() {
    const payload = this.provider.render();
    return {
      content: payload.content ?? '',
      embeds: payload.embeds ?? [],
      components: this.buildComponents(),
    };
  }

  get invalidClickWarning() {
    return [
      "Don't click! <:youBad:888716976145461249>.",
      "Don't click! <:youBad:888716976145461249>, I'll ban you!",
      'Eat this chocolate Instead! 🍫',
      "Nope, I'm not responding to you!,👻",
    ][Math.floor(Math.random() * 4)];
  }

  async delete() {
    return this.refMsg instanceof Message ? this.msg?.delete() : this.refMsg.deleteReply();
  }

  async refresh(opts?: { jumpToLastPage?: boolean }) {
    if (!this.msg) return;
    if (opts?.jumpToLastPage) this.page = this.length;
    await this.msg.edit(this.value).catch(() => {});
  }

  async goto(interaction: MessageComponentInteraction) {
    await interaction.showModal({
      title: `Jump to Page [40seconds]`,
      customId: 'goto',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              label: `Enter page you wanna jump to: [1-${this.length}].`,
              customId: 'topage',
              style: TextInputStyle.Short,
              required: true,
              minLength: 1,
              maxLength: this.length.toString().length,
              placeholder: 'Index of Page. eg,(1)',
            },
          ],
        },
      ],
    });
    interaction
      .awaitModalSubmit({
        filter: (x) =>
          +x.fields.getTextInputValue('topage') > 0 &&
          +x.fields.getTextInputValue('topage') < this.length + 1,
        time: 40000,
      })
      .then((i) => {
        this.page = +i.fields.getTextInputValue('topage');
        if (i.isFromMessage()) i.update(this.value);
      })
      .catch(() => {});
  }


private buildComponents(disabled?: boolean): MessageCreateOptions['components'] {
  const client = this.refMsg.client as ExtendClient;
  const rows: ActionRowData<MessageActionRowComponentData>[] = [
    {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          emoji: client.config.emojis.leftArrow,
          customId: 'left',
          disabled: disabled ?? (this.page == 1 || this.length == 1),
        },
        {
          type: ComponentType.Button,
          label: `${this.page} of ${this.length}`,
          style: ButtonStyle.Primary,
          customId: 'page',
          emoji: '📑',
          disabled: disabled ?? this.length < 3,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          emoji: client.config.emojis.rightArrow,
          customId: 'right',
          disabled: disabled ?? (this.length == 1 || this.page == this.length),
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          emoji: client.config.emojis.cross,
          customId: 'delete',
          disabled,
        },
      ],
    },
  ];

  if (this.views.length > 1) {
    rows.push({
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.StringSelect,
          customId: 'select',
          disabled,
          options: this.views.map((v, i) => ({
            label: v.title ?? `View ${i + 1}`,
            value: i.toString(),
            description: v.description,
            emoji: v.emoji,
            default: i == this.viewIndex,
          })),
        },
      ],
    });
  }

  return rows as MessageCreateOptions['components'];
}

  private async init() {
    if (!this.msg) return;

    const collector = this.msg.createMessageComponentCollector({
      idle: 120000,
      dispose: true,
    });

    collector.on('collect', async (interaction) => {
      if (!this.filter(interaction)) {
        interaction.reply({ ephemeral: true, content: this.invalidClickWarning });
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
          return; // goto handles its own reply via modal; don't fall through to interaction.update
        case 'delete':
          await this.delete().catch(() => {});
          return;
        case 'select':
          this.viewIndex = +(interaction as StringSelectMenuInteraction).values[0];
          break;
      }
      interaction.update(this.value).catch(() => {});
    });

    collector.on('end', () => {
      this.msg?.edit({ components: this.buildComponents(true) }).catch(() => {});
    });
  }
}
