import { TextCommand } from 'client/interface';
import { ButtonStyle, ComponentType } from 'discord.js';

export const command: TextCommand = {
  name: 'emoji',
  aliases: ['e', 'emo'],
  description: 'sends emoji for you!',
  args: false,
  argsHelp: ['?<emoji_name>'],
  examples: ['hi', 'youbad'],

  async run({ client, msg, args }) {
    if (args.length) {
      const e = Object.values(client.searchEmoji(args[0]))[0];
      if (!e) return msg.reply('Specified Emoji not Found!');
      msg.reply({
        content: e.toString(),
        allowedMentions: { repliedUser: false },
      });
    } else {
      // generates random emoji
      const emoji = {
        emojis: msg.client.emojis.cache.map((e) => e.toString()),
        get generate() {
          return this.emojis[Math.ceil(Math.random() * this.emojis.length)];
        },
      };

      const message = await msg.reply({
        content: emoji.generate,
        allowedMentions: { repliedUser: false },
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                emoji: client.config.emojis.rollCat,
                customId: 'primary',
                label: 'Refresh',
              },
            ],
          },
        ],
      });

      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        idle: 120000,
        dispose: true,
        filter(interaction) {
          return interaction.user.id === msg.author.id;
        },
      });

      collector.on('collect', (interaction) => {
        interaction.update({
          content: emoji.generate,
        });
      });

      collector.on('end', () => {
        message.edit({ components: [] }).catch(() => null);
      });
    }
  },
};
