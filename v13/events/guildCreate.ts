import { Guild, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
  name: 'guildCreate',

  execute(client, guild: Guild) {
    // set status when in production
    if (!process.env.BETA)
      client.user!.setPresence({
        status: 'online',
        activities: [
          {
            name: `${client.config.prefix} commands in ${client.guilds.cache.size} servers`,
            type: 'LISTENING',
          },
        ],
      });

    const channel = client.channels.cache.get(client.config.channels.serverLog);
    if (!channel || !(channel instanceof TextChannel)) return;

    channel.send({
      embeds: [
        {
          title: `Joined New Server ${client.config.emojis.yus}`,
          description: `\`\`\`js\n{\n  name: ${guild.name}\n  ID: ${guild.id}\n  guildDescription: ${guild.description}\n  ownerId: ${guild.ownerId} \n}\`\`\``,
          thumbnail: {
            url:
              guild.iconURL({
                dynamic: true,
                size: 4096,
              }) ??
              'https://discord.com/assets/ca03beabe94d8f97ba6fbf75cbb695c4.png',
          },
          timestamp: new Date(),
          color: '#2f3136',
        },
      ],
    });
  },
};
