import {
  CommandInteraction,
  Interaction,
  Message,
  MessageContextMenuInteraction,
  Snowflake,
  UserContextMenuInteraction,
} from 'discord.js';
import { select } from '..';
import { embedHandler } from './embedHandler';
import { objectHandler } from './objectHandler';
import { stringHandler } from './stringHandler';
import { PaginationArgument, PaginationOption } from './types';
/////////////////////////////////////////////////////

// MAIN exported Class

export default class pagination {
  declare msg: Message;
  declare author: Snowflake;
  private declare HandleHandler: objectHandler | undefined;
  private declare handler: stringHandler | embedHandler;
  public buttons = ['🔢', '⏮️', '◀️', '▶️', '⏭️', '🗑️', '↕️'];
  constructor(
    message:
      | Message
      | CommandInteraction
      | UserContextMenuInteraction
      | MessageContextMenuInteraction,
    argument: PaginationArgument,
    options?: PaginationOption<PaginationArgument>,
  ) {
    if (typeof argument == 'string') {
      this.handler = new stringHandler(
        argument,
        options?.chunkSize,
        options?.title,
        options?.secondaryTitle,
        options?.code,
        options?.timestamp,
      );
    } else if (Array.isArray(argument)) {
      this.handler = new embedHandler(argument);
    } else if (typeof argument == 'object') {
      this.HandleHandler = new objectHandler(argument);
      this.handler = this.HandleHandler.value(0);
    }

    if (message instanceof Message) {
      message.channel.send(this.handler.value).then((m0) => {
        this.msg = m0;
        this.main();
      });
      this.author = message.author.id;
    }
    //TODO : if ever fails set deferReply
    else if (message instanceof Interaction) {
      if (typeof this.handler.value == 'string')
        message
          .reply({
            content: this.handler.value,
            fetchReply: true,
          })
          .then((m0) => {
            if (!(m0 instanceof Message))
              return new Error('Invalid instance if message');
            this.msg = m0;
            this.main();
          });
      else if (Array.isArray(argument))
        message
          .reply({
            embeds: this.handler.value.embeds,
            fetchReply: true,
          })
          .then((m0) => {
            if (!(m0 instanceof Message))
              return new Error('Invalid instance if message');
            this.msg = m0;
            this.main();
          });
      this.author = message.user.id;
    }
  }
  private async main() {
    if (!!this.HandleHandler) await this.msg.react(this.buttons[6]);
    if (this.handler.length > 2 || this.HandleHandler)
      await this.msg.react(this.buttons[0]);
    if (this.handler.length > 2 && !this.HandleHandler)
      await this.msg.react(this.buttons[1]);
    if (this.handler.length > 1 || this.HandleHandler)
      await this.msg.react(this.buttons[2]);
    if (this.handler.length > 1 || this.HandleHandler)
      await this.msg.react(this.buttons[3]);
    if (this.handler.length > 2 && !this.HandleHandler)
      await this.msg.react(this.buttons[4]);
    this.msg.react(this.buttons[5]);

    const reactionCollector = this.msg.createReactionCollector({
      filter: (react, user) =>
        user.id == this.author &&
        this.buttons.includes(decodeURI(react.emoji.identifier)),
      idle: 120000,
    });

    reactionCollector.on('end', () => {
      this.msg.reactions.removeAll().catch(() => null);
    });

    reactionCollector.on('collect', async (react) => {
      react.users.remove(this.author).catch(() => null);
      let pg = this.handler.page;
      const func = [
        () => {
          this.goToPage();
        },
        () => {
          pg = 1;
        },
        () => {
          pg -= +(pg > 1);
        },
        () => {
          pg += +(pg < this.handler.length);
        },
        () => {
          pg = this.handler.length;
        },
        () => {
          this.msg.delete().catch(() => null);
        },
        async () => {
          if (!this.HandleHandler) return;
          const num = await select(
            this.msg,
            {
              title: 'Select Page List',
              options: this.HandleHandler.keys.map((k, i) => {
                return { label: k, description: k, value: '' + i };
              }),
            },
            (interaction: Interaction) => {
              return interaction.user.id == this.author;
            },
          ).catch(() => null);
          if (num) {
            this.handler = this.HandleHandler.value(+num);
            this.render();
          }
        },
      ][this.buttons.indexOf(decodeURI(react.emoji.identifier))]();
      if (!(pg == this.handler.page)) {
        this.handler.page = pg;
        this.render();
      }
    });
  }

  async goToPage() {
    this.msg.channel.send('\\⚡ Page! You wanna jump to ?').then(async (m0) => {
      return m0.channel
        .awaitMessages({
          filter: (f: Message) => f.author.id == this.author,
          time: 120000,
          max: 1,
        })
        .then((c) => {
          m0.delete().catch(() => null);
          if (
            !/^\d+$/.test(c?.first()?.content ?? '') ||
            parseInt(c?.first()?.content ?? '') < 1 ||
            parseInt(c?.first()?.content ?? '') > this.handler.length
          )
            return;
          this.handler.page = parseInt(c?.first()?.content ?? '2');
          c.first()
            ?.delete()
            .catch(() => null);
          this.render();
          // .catch in case its already deleted
        })
        .catch(() => m0.delete().catch(() => null));
    });
  }
  render() {
    this.msg.edit(this.handler.value).catch(() => null);
  }
}
