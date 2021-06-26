module.exports = {
  name: 'info-emoji',
  aliases: ['infomoji', 'imo'],
  description: 'emoji image with details',
  usage : '[id or name or <emoji>]',
  args: true,
  execute({ msg, args }) {
    msg.channel.startTyping();
    let emote = {};
    let emojiReg = /^<a?:\w{1,20}:\d{1,32}>$/;
    if (emojiReg.test(args[0])) {
      let parts = args[0]
        .replace(/<|>/g, '')
        .split(':');
      emote = {
        animated: !!parts[0].length,
        name: parts[1],
        id: parts[2],
        guild: msg.client.emojis.cache.find(e =>
          e.id == parts[2])?.guild?.name,
      };
      this.send(msg, emote);
    }
    else if (args[0] * 0 === 0) {
      emote.id = args[0];
      let emo = msg.client.emojis.cache.find(e =>
        e.id == args[0]);
      emote.name = emo?.name;
      emote.animated = emo?.animated;
      emote.guild = emo?.guild?.name;
      if (!emo) {
        const fetch = require('node-fetch');
        fetch(`https://cdn.discordapp.com/emojis/${args[0]}.gif`)
          .then(resp => {
            if (resp.status == 200) {
              emote.animated = true;
              this.send(msg, emote);
            }
            else {
              fetch(`https://cdn.discordapp.com/emojis/${args[0]}.png`)
                .then(resp =>
                  this.send(msg, emote, resp.status));
            }
          });
      } 
      else this.send(msg,emote);
      delete emo;
    }
    else {
      let emo = msg.client.emojis.cache.find(e =>
        e.name.toLowerCase() == args[0].toLowerCase());
      if (emo) {
        emote = {
          animated: emo.animated,
          name: emo.name,
          id: emo.id,
          guild: emo.guild.name
        }
        delete emo;
      }
      this.send(msg, emote)
    }

  },
  send(msg, emote, status = 200) {
    if (emote.id && status == 200) {
      msg.channel.send({embed:{
        
        image : {
          url : `https://cdn.discordapp.com/emojis/${emote.id}.${(emote.animated)?'gif':'png'}`,
        },
        description : `\`\`\`\nName : ${emote.name??'uknown'
          }\nID : ${emote.id
          }\nAnimated : ${emote.animated??false
          }\nGuild : ${emote.guild??'uknown'} \`\`\``,
      }});
      delete emote;
    }
    else msg.reply('Your Specified emoji wasn\'t found!');
    msg.channel.stopTyping();
  }
}