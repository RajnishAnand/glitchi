import { TextCommand } from 'client/interface';
import {
  User,
  GuildMember,
  Message,
  EmbedBuilder,
  PermissionsString,
} from 'discord.js';

export const command: TextCommand = {
  name: 'user',
  aliases: ['whois', 'userinfo'],
  description: 'user details.',
  args: false,
  argsHelp: ['?<@mention||id>'],
  examples: ['@glitchi'],

  run({ client, msg, args }) {
    if (args[0]) {
      let id = args[0].replace(/^<@!?/, '').replace(/>$/, '');
      if (/^\d+$/.test(id)) {
        msg.client.users
          .fetch(id)
          .then((u) => {
            msg.guild?.members
              .fetch(u.id)
              .then((gu) => {
                msg.channel.send({
                  embeds: embedIt(msg, u, gu),
                });
              })
              .catch(() => {
                msg.channel.send({
                  embeds: embedIt(msg, u),
                });
              });
          })
          .catch((err: Error) => msg.reply(err.message));
      } else {
        msg.react(client.config.emojis.sad);
        return msg.reply("your specified user wasn't found!");
      }
    } else {
      msg.channel.send({
        embeds: embedIt(msg, msg.author, msg.member),
      });
    }
  },
};
/** Returns [Embed] for User command */
function embedIt(msg: Message, user: User, member: GuildMember | null = null) {
  let embed = new EmbedBuilder({
    color: 0x00bfff,
    title: user.tag,
    url: `https://discordapp.com/users/${user.id}`,
    thumbnail: {
      url: user.displayAvatarURL({
        extension: 'png',
      }),
    },
    fields: [],
    footer: {
      text: '| Requested by ' + msg.author.tag,
      icon_url: msg.author.avatarURL({ extension: 'png' }) ?? undefined,
    },
  });

  let description = `>>> **Username** :\` ${user.username} \`\n**ID** :\` ${
    user.id
  } \`\n🖼️ | **Avatar** : [[png]](${user.displayAvatarURL({
    extension: 'png',
    size: 4096,
  })})\`|\`[[jpg]](${user.displayAvatarURL({
    extension: 'jpg',
    size: 4096,
  })})\`|\`[[webp]](${user.displayAvatarURL({
    extension: 'webp',
    size: 4096,
  })})\n**🤖 | Bot** :\` ${user.bot}\`\n**⏳ | Created** : <t:${Math.ceil(
    +user.createdAt / 1000,
  )}:R>`;

  // BADGES EmbedField
  const badges = user.flags?.toArray().join(', ');
  if (badges)
    embed.addFields({
      name: '🎗️| Badges : ',
      value: `\`\`\`\n${badges}\`\`\``,
      inline: false,
    });

  if (member && member.joinedAt) {
    description += `\n🍻 | **Joined** : <t:${Math.ceil(
      +member.joinedAt / 1000,
    )}:R>`;

    // ROLES EmbedField
    const roles: string[] = member.roles.cache
      .filter((r) => r.id != member.guild.id)
      .map((r) => r.toString());

    if (roles.length)
      embed.addFields({
        name: `🪃| Roles [${roles.length}]: `,
        value: roles.join(', '),
        inline: false,
      });

    // KEY PERMISSIONS EmbedField
    const keyPerms: PermissionsString[] = [
      'KickMembers',
      'BanMembers',
      'ManageChannels',
      'ManageGuild',
      'ManageMessages',
      'MentionEveryone',
      'ManageNicknames',
      'ManageRoles',
      'ManageWebhooks',
      'ManageEmojisAndStickers',
      'ManageEvents',
      'ManageThreads',
    ];

    const permKeys = member.permissions.toArray();
    let userKeyPerms: string | undefined;

    if (permKeys.includes('Administrator')) {
      userKeyPerms = 'ALL_PERMISSIONS';
    } else if (keyPerms.every((p) => permKeys.includes(p))) {
      userKeyPerms = 'MODERATION_PRIVILEGE';
    } else if (keyPerms.some((p) => permKeys.includes(p))) {
      userKeyPerms = permKeys
        .filter((perm: PermissionsString) => keyPerms.includes(perm))
        .join(', ');
    }

    if (userKeyPerms) {
      embed.addFields({
        name: `🥷| Key Permissions : `,
        value: '```\n' + userKeyPerms + '```',
        inline: false,
      });
    }
  }
  embed.setDescription(description);

  return [embed];
}
