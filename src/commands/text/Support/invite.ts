import { TextCommand } from 'client/interface';
import { ButtonStyle, ComponentType } from 'discord.js';

const INVITE_URL =
  'https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot%20applications.commands&permissions=413927861313';
const SUPPORT_SERVER_INVITE = 'https://discord.gg/EuShUmJrZR';
const GITHUB_URL = 'http://github.com/rajnishanand/glitchi';
const BANNER_IMAGE_URL =
  'https://media.discordapp.net/attachments/906985861525155880/934092437473886288/2022-01-21-19-45-37.jpg';
const EMBED_COLOR = 0x00bfff;

export const command: TextCommand = {
  name: 'invite',
  aliases: ['repo', 'support'],
  description: 'invite glitchi to your server!',
  args: false,
  run({ msg }) {
    const client = msg.client;

    msg.reply({
      embeds: [
        {
          color: EMBED_COLOR,
          author: {
            name: client.user!.username,
            icon_url: client.user!.displayAvatarURL(),
          },
          description:
            '> Invite Glitchi to your Server! You can also join the Glitchi Support Server for testing 💌.',
          image: {
            url: BANNER_IMAGE_URL,
          },
          timestamp: new Date().toISOString(),
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'Invite',
              style: ButtonStyle.Link,
              url: INVITE_URL,
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Link,
              label: 'Join Support Server',
              url: SUPPORT_SERVER_INVITE,
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Link,
              label: 'Github',
              url: GITHUB_URL,
            },
          ],
        },
      ],
    });
  },
};
