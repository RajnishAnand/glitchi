import ExtendClient from 'client';
import {
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  MessageEditOptions,
  Message,
  MessageContextMenuCommandInteraction,
  MessageCreateOptions,
  TextInputStyle,
  UserContextMenuCommandInteraction,
  SelectMenuInteraction,
  MessageComponentInteraction,
} from 'discord.js';
import EmbedHandler from './handlers/embed';
import StringHandler from './handlers/string';

export abstract class basePagination {
  abstract handler: StringHandler | EmbedHandler;
  abstract refMsg:
    | Message
    | CommandInteraction
    | UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction;
  abstract msg: Message;
  abstract filter: (i: ButtonInteraction | SelectMenuInteraction) => boolean;
  abstract value: {
    embed?: MessageEditOptions['embeds'];
    content?: string;
    components: MessageEditOptions['components'];
  };

  get page() {
    return this.handler.page;
  }
  get length() {
    return this.handler.length;
  }
  set page(x: number) {
    this.handler.page = x > 0 && x < this.length + 1 ? x : this.page;
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
    return this.refMsg instanceof Message
      ? this.msg.delete()
      : this.refMsg.deleteReply();
  }

  // jump to page
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

  components(disabled?: boolean): MessageCreateOptions['components'] {
    return [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            emoji: (this.refMsg.client as ExtendClient).config.emojis.leftArrow,
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
            emoji: (this.refMsg.client as ExtendClient).config.emojis
              .rightArrow,
            customId: 'right',
            disabled:
              disabled ?? (this.length == 1 || this.page == this.length),
          },
          {
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            emoji: (this.refMsg.client as ExtendClient).config.emojis.cross,
            customId: 'delete',
            disabled,
          },
        ],
      },
    ];
  }
}
