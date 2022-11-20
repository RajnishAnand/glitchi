import { Event } from 'client/interface';
import { Guild, TextChannel } from 'discord.js';

export const event: Event = {
  name: 'guildDelete',

  execute(client, guild: Guild) {
    // set status when in production
    if (!process.env.BETA) client.updateStatus();

    const channel = client.channels.cache.get(client.config.channels.serverLog);
    if (!channel || !(channel instanceof TextChannel)) return;

    channel.send({
      embeds: [
        {
          title: `Server Lost ${client.config.emojis.cry}`,
          description: `\`\`\`js\n{\n  name: ${guild.name}\n  ID: ${guild.id}\n  guildDescription: ${guild.description}\n  ownerId: ${guild.ownerId} \n}\`\`\``,
          thumbnail: {
            url:
              guild.iconURL({ size: 4096 }) ??
              'https://discord.com/assets/ca03beabe94d8f97ba6fbf75cbb695c4.png',
          },
          timestamp: new Date().toISOString(),
          color: 0xff5500,
        },
      ],
    });
  },
};
