import { argumentObjectType, message } from '../types';
import pm from 'pretty-ms';
import { User, GuildMember ,PermissionString} from 'discord.js';

class run {
  declare msg: message;
  constructor({ msg, args }: argumentObjectType) {
    this.msg = msg;
    this.main(args)
  }
  async main(args: string[]) {
    if (args[0]) {
      let id = args[0]
        .replace(/^<@!?/, '')
        .replace(/>$/, '');
      if (/^\d+$/.test(id)) {
        this.msg.client.users.fetch(id)
          .then((u: User) => {
            this.msg.guild.members.fetch(u.id)
              .then((gu: GuildMember) => this.send(u, gu))
              .catch(() => this.send(u));
          })
          .catch((err: Error) => this.msg.reply(err.message));
      }
      else{
        this.msg.react(global.config.emojis.sad);
        return this.msg.reply('your specified user wasn\'t found!')
      }
    }
    else {
      this.send(this.msg.author, this.msg.member);
    }
  }

  send(user: User, member:GuildMember|null=null) {
    let embed = {
      color: '#00bfff',
      title: user.tag,
      url: `https://discordapp.com/users/${user.id}`,
      description: `>>> **Username** :\` ${user.username
        } \`\n**ID** :\` ${user.id
        } \`\n**Avatar** : [[png]](${user.displayAvatarURL({
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
        })\n**Bot** :\` ${user.bot} \``,
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
      {
        name: '⏳| Created : ',
        value: `\`\`\`\n${user.createdAt
          .toString()
          .split(" ")
          .slice(0,4)
          .join(' ')
        }\n${pm(Date.now()-user.createdTimestamp)} ago\`\`\``,
        inline: true,
      }
    ],
    footer: {
      text: '| Requested by ' + this.msg.author.username,
      icon_url: this.msg.author.avatarURL({ format: 'png' })
    }
  };
  if (member) {
    const keyPerms :PermissionString[]= [
      'KICK_MEMBERS', 'BAN_MEMBERS',
      'MANAGE_CHANNELS', 'MANAGE_GUILD',
      'MANAGE_MESSAGES', 'MENTION_EVERYONE',
      'MANAGE_NICKNAMES', 'MANAGE_ROLES',
      'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS'
    ];

    embed.fields.push({
      name: '🍻| Joined : ',
      value: `\`\`\`\n${new Date(member.joinedTimestamp??0)
            .toString()
            .split(" ")
            .slice(0,4)
            .join(' ')
            }\n${pm(Date.now()-(member.joinedTimestamp??0))} ago\`\`\``,
      inline: true,
    }, {
      name: `🪃| Roles [${member
        .roles.cache.size-1}]: `,
      value: (member.roles.cache.size - 1) ? member.roles.cache.filter((r) => r.id != this.msg.guild.id).map((r: any) => r).join(", ") : '` NONE `',
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
      })
    }


  };
  this.msg.channel.send({ embed });
}

}

export default {
  name: 'user',
  aliases: ['whois', 'userinfo'],
  description: 'user details.',
  usage: '[optional : <mention> or <id>]',
  // args : boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}
