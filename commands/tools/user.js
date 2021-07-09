const pm= require('pretty-ms');
module.exports = {
  name : 'user',
  aliases : ['whois', 'userinfo'],
  description : 'user details.',
  usage : '[optional : <mention> or <id>]',
  execute({msg,args}){
    if(args[0]){
      let id = args[0]
        .replace(/^<@!?/,'')
        .replace(/>$/,'');
      if(id*0==0){
        msg.client.users.fetch(id)
          .then(u=>{
            msg.guild.members.fetch(u.id)
              .then(gu=>send(msg,u,gu))
              .catch(err=>send(msg,u));
          })
          .catch(err=>msg.reply(err.message));
      }
      else send(msg);
    }
    else{
      send(msg,msg.author,msg.member);
    }
  },
}

function send(msg,user=false,member=false){
  let embed = {};
  if(user){
    embed = {
      color : '#00bfff',
      title : user.tag,
      url : `https://discordapp.com/users/${user.id}`,
      description : `>>> **Username** :\` ${user.username
        } \`\n**ID** :\` ${user.id
        } \`\n**Avatar** : [[png]](${user.displayAvatarURL({
            format : 'png',
            dynamic : 'true',
            size : 4096
          })
        })\`|\`[[jpg]](${user
          .displayAvatarURL({
            format : 'jpg',
            dynamic : 'true',
            size : 4096
          })
        })\`|\`[[webp]](${user
          .displayAvatarURL({
            format : 'webp',
            dynamic : 'true',
            size : 4096
          })
        })\n**Bot** :\` ${user.bot} \``,
      thumbnail : {
        url : user.displayAvatarURL({
          format : 'png',
          dynamic : 'true'
        })
      },
      fields : [
        {
          name : '🎗️| Badges : ',
          value : `\`\`\`\n${user.flags.toArray().length?user.flags.toArray().join(', '):'NONE'}\`\`\``,
        },
        {
          name: '⏳| Created : ',
          value :`\`\`\`\n${user.createdAt
            .toString()
            .split(" ")
            .slice(0,4)
            .join(' ')
            }\n${pm(Date.now()-user.createdTimestamp)} ago\`\`\``,
          inline : true,
        }
      ],
      footer : {
        text: '| Requested by '+msg.author.username,
        icon_url:msg.author.avatarURL({format:'png'})
      }
    };
  }
  else{
    msg.react('860576595039354931');
    return msg.reply('your specified user wasn\'t found!')
  }
  if(member){
    const keyPerms = [
      'KICK_MEMBERS',     'BAN_MEMBERS',
      'MANAGE_CHANNELS',  'MANAGE_GUILD',  
      'MANAGE_MESSAGES',  'MENTION_EVERYONE',
      'MANAGE_NICKNAMES', 'MANAGE_ROLES',     
      'MANAGE_WEBHOOKS',  'MANAGE_EMOJIS'
    ];
    
    embed.fields.push({
      name : '🍻| Joined : ',
      value :`\`\`\`\n${new Date(member.joinedTimestamp)
            .toString()
            .split(" ")
            .slice(0,4)
            .join(' ')
            }\n${pm(Date.now()-member.joinedTimestamp)} ago\`\`\``,
      inline : true ,
    },{
      name : `🪃| Roles [${member
        .roles.cache.size-1}]: `,
      value :(member.roles.cache.size-1)?member.roles.cache.filter(r=>r.id!=msg.guild.id).map(r=>r).join(", "):'` NONE `',
    });
    
    const permKeys = member.permissions.toArray();
    let userKeyPerms = '';
    
    if(permKeys.includes('ADMINISTRATOR')){
      userKeyPerms = 'ALL_PERMISSIONS'
    }
    else if(keyPerms.every(p => 
      permKeys.includes(p))){
        userKeyPerms = 'MODERATION_PRIVILEGE'
    }
    else if(keyPerms.some(p => permKeys.includes(p))){
      userKeyPerms = permKeys
        .filter(perm=>keyPerms.includes(perm))
        .join(', ');
    }
    else{
      userKeyPerms = permKeys.length?permKeys
        .join(", "):'NONE';
    }

    if(userKeyPerms){
      embed.fields.push({
        name : `🥷| Key Permissions : `,
        value : '```\n'+userKeyPerms+'```',
      })
    }
  

  };
  msg.channel.send({embed});
} 