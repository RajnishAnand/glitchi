const pm= require('pretty-ms')
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
        } \`\n**Avatar** : [[Avatar-URL]](${user.displayAvatarURL({
            format : 'png',
            dynamic : 'true',
          })
        }?size=2048)\n**Bot** :\` ${user.bot} \``,
      thumbnail : {
        url : user.displayAvatarURL({
          format : 'png',
          dynamic : 'true'
        })
      },
      fields : [
        {
          name : '🎗️| Badges : ',
          value : `\`\`\`\n${user.flags.toArray().length?user.flags.toArray().join(', '):'NONE'}\`\`\``
        },
        {
          name: '⏳| Created : ',
          value :`\`\`\`\n${user.createdAt
            .toString()
            .split(" ")
            .slice(0,4)
            .join(' ')
            }\n${pm(Date.now()-user.createdTimestamp)} ago\`\`\``
        }
      ],
      footer : {
        text: '|Requested by '+msg.author.username,
        icon_url:msg.author.avatarURL({format:'png'})
      }
    };
  }
  else{
    msg.react('860576595039354931');
    return msg.reply('your specified user wasn\'t found!')
  }
  if(member){
    embed.fields.push({
      name : '🍻| Joined : ',
      value :`\`\`\`\n${new Date(member.joinedTimestamp)
            .toString()
            .split(" ")
            .slice(0,4)
            .join(' ')
            }\n${pm(Date.now()-member.joinedTimestamp)} ago\`\`\``
    },{
      name : `🪃| Roles [${member
        .roles.cache.size-1}]: `,
      value :(member.roles.cache.size-1)?member.roles.cache.filter(r=>r.id!=msg.guild.id).map(r=>r).join(", "):'` NONE `',
    },{
      name : `🥷| Permissions : `,
      value : '```\n'+(member.permissions.toArray().includes('ADMINISTRATOR')?'ADMINISTRATOR':member.permissions.toArray().join(', '))+'```'
    });
  };
  msg.channel.send({embed});
} 