import { TextCommand } from 'client/interface';
import { ButtonStyle, ComponentType } from 'discord.js';

export const command: TextCommand = {
  name: 'invite',
  aliases: ['repo', 'support'],
  description: 'invite glitchi to your server!',
  args: false,

  run({ msg }) {
    msg.channel.send({
      embeds: [
        {
          color: 0x00bfff,
          author: {
            name: 'Glitchi',
            icon_url:
              'https://cdn.discordapp.com/avatars/852227150455373906/2f06054bcc4e7cea81c975f97849eb91.png',
          },
          description:
            '> Invite Glitch to your Server! you can join Glitchi Support Server for testing 💌. ',
          image: {
            url: 'https://media.discordapp.net/attachments/906985861525155880/934092437473886288/2022-01-21-19-45-37.jpg',
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
              url: 'https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot%20applications.commands&permissions=413927861313',
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Link,
              label: 'Join Support Server',
              url: 'https://discord.gg/EuShUmJrZR',
            },
            {
              type: ComponentType.Button,
              style: ButtonStyle.Link,
              label: 'Github',
              url: 'http://github.com/rajnishanand/glitchi',
            },
          ],
        },
      ],
    });
  },
};
