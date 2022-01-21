import { User, GuildMember ,PermissionString,MessageEmbed} from 'discord.js';
import {Command} from 'Interfaces';

export const command: Command = {
  name: 'user',
  aliases: ['whois', 'userinfo'],
  description: 'user details.',
  usage: '?<@mention||id>',
  examples :['@glitchi'],

  run({msg,args}){
    if (args[0]) {
      let id = args[0].replace(/^<@!?/, '').replace(/>$/, '');
      if (/^\d+$/.test(id)) {
        msg.client.users.fetch(id)
          .then((u) => {
            msg.guild?.members.fetch(u.id)
              .then((gu) => msg.channel.send({
                embeds : embedIt(u, gu)
              }))
              .catch(() => msg.channel.send({
                embeds : embedIt(u)}))
          })
          .catch((err: Error) => msg.reply(err.message));
      }
      else{
        msg.react(msg.client.config.emojis.sad);
        return msg.reply('your specified user wasn\'t found!')
      }
    }
    else {
      msg.channel.send({
        embeds : embedIt(msg.author, msg.member)
      });
    }
  }
}


function embedIt(user: User, member:GuildMember|null=null) {
  let embed = new MessageEmbed({
    color: 0x00bfff,
    title: user.tag,
    url: `https://discordapp.com/users/${user.id}`,
    description: `>>> **Username** :\` ${user.username
      } \`\n**ID** :\` ${user.id
      } \`\n🖼️ |**Avatar** : [[png]](${user.displayAvatarURL({
          format : 'png',
          dynamic : true,
          size : 4096
        })
      })\`|\`[[jpg]](${user
        .displayAvatarURL({
          format : 'jpg',
          dynamic : true,
          size : 4096
        })
      })\`|\`[[webp]](${user
        .displayAvatarURL({
          format : 'webp',
          dynamic : true,
          size : 4096
        })
      })\n**🤖 |Bot** :\` ${user.bot
      }\`\n**⏳ |Created** : <t:${Math.ceil(+user.createdAt/1000)}:R>`,
    thumbnail: {
      url: user.displayAvatarURL({
        format: 'png',
        dynamic: true
      })
    },
    fields: [
      {
        name: '🎗️| Badges : ',
        value: `\`\`\`\n${user.flags?.toArray().length?user.flags.toArray().join(', '):'NONE'}\`\`\``,
        },
    ],
    footer: {
      text: '| Requested by ' + user.username,
      icon_url: user.avatarURL({ format: 'png' })??undefined
    }
  });
  if (member&&member.joinedAt) {
    const keyPerms :PermissionString[]= [
      'KICK_MEMBERS', 'BAN_MEMBERS',
      'MANAGE_CHANNELS', 'MANAGE_GUILD',
      'MANAGE_MESSAGES', 'MENTION_EVERYONE',
      'MANAGE_NICKNAMES', 'MANAGE_ROLES',
      'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS',
      'MANAGE_EVENTS', 'MANAGE_THREADS'
    ];
  
    embed.description += `\n🍻 |**Joined** : <t:${Math.ceil(+member.joinedAt/1000)}:R>`,

    embed.fields.push({
      name: `🪃| Roles [${member
        .roles.cache.size-1}]: `,
      value: (member.roles.cache.size - 1) ? member.roles.cache.filter((r) => r.id != member.guild.id).map((r: any) => r).join(", ") : '` NONE `',
      inline : false,
    });
  
    const permKeys = member.permissions.toArray();
    let userKeyPerms = '';
  
    if (permKeys.includes('ADMINISTRATOR')) {
      userKeyPerms = 'ALL_PERMISSIONS'
    }
    else if (keyPerms.every(p =>
        permKeys.includes(p))) {
      userKeyPerms = 'MODERATION_PRIVILEGE'
    }
    else if (keyPerms.some(p => permKeys.includes(p))) {
      userKeyPerms = permKeys
        .filter((perm:PermissionString) => keyPerms.includes(perm))
        .join(', ');
    }
    else {
      userKeyPerms = permKeys.length ? permKeys
        .join(", ") : 'NONE';
    }
  
    if (userKeyPerms) {
      embed.fields.push({
        name: `🥷| Key Permissions : `,
        value: '```\n' + userKeyPerms + '```',
        inline : false
      })
    }
  
  };
  return [embed];
}

