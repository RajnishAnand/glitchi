module.exports = {
  name: 'info-emoji',
  aliases: ['infomoji', 'imo'],
  description: 'emoji image with details',
  usage : '[<id> or <querry> or "<name>" or <emoji>]',
  args: true,
  execute({ msg, args }:any) {
    msg.channel.startTyping();
    let emojiReg = /^<a?:\w{1,20}:\d{1,32}>$/;
    if (emojiReg.test(args[0])) {
      let parts = args[0]
        .replace(/<|>/g, '')
        .split(':');
      this.send(msg, {
        animated: !!parts[0].length,
        name: parts[1],
        id: parts[2],
        guild: msg.client.emojis.cache.find((e:emoji) =>
          e.id == parts[2])?.guild?.name,
      });
    }
    else if (args[0] * 0 === 0 && args[0].length<33) {
      let emo = msg.client.emojis.cache.find((e:emoji) =>
        e.id == args[0]);
      let emote = {
        id : args[0],
        name : emo?.name,
        animated : emo?.animname,
        guild : emo?.guild?.name,
      }
      if (!emo) {
        const fetch = require('node-fetch');
        fetch(`https://cdn.discordapp.com/emojis/${args[0]}.gif`)
          .then((resp:any) => {
            if (resp.status == 200) {
              emote.animated = true;
              this.send(msg, emote);
            }
            else {
              fetch(`https://cdn.discordapp.com/emojis/${args[0]}.png`)
                .then((resp:any) =>
                  this.send(msg, emote, resp.status));
            }
          });
      } 
      else this.send(msg,emote);
    }
    else if(args[0].length<21) {
      let emo:any;
      if(args[0][0]=='"'){
        args[0] = args[0].replace(/^"/,'').replace(/"$/,'');
        emo = msg.client.emojis.cache
          .find((e:emoji)=>e.name==args[0])
      }
      else {
        emo = msg.client.emojis.cache.find((e:any) =>
        new RegExp('^'+args[0],'i').test(e.name))
      };
      if (emo) {
        this.send(msg,{
          animated: emo.animated,
          name: emo.name,
          id: emo.id,
          guild: emo.guild.name
        })
      }
      else this.send(msg,false);
    }
    else this.send(msg,false);

  },
  send(msg:any, emote:emoji|false, status = 200) {
    if (emote && status == 200) {
      msg.channel.send({embed:{
        
        image : {
          url : `https://cdn.discordapp.com/emojis/${emote.id}.${(emote.animated)?'gif':'png'}`,
        },
        description : `\`\`\`\nName : ${emote.name??'uknown'
          }\nID : ${emote.id
          }\nAnimated : ${emote.animated??false
          }\nGuild : ${emote.guild??'uknown'} \`\`\``,
      }});
    }
    else msg.reply('Your Specified emoji wasn\'t found!');
    msg.channel.stopTyping();
  }
}

interface emoji {
  name : string|undefined,
  id : string|undefined,
  animated : boolean,
  guild?:string
}