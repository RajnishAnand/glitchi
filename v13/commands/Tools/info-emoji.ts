import fetch from 'node-fetch';
import {pageView} from '#libs';
import {Command} from 'Interfaces';
import {MessageEmbed} from 'discord.js';

export const command : Command= {
  name: 'info-emoji',
  aliases: ['infomoji', 'imo'],
  description: 'emoji image with details',
  usage : '<id||querry||emoji>',
  examples : ["hi","youbad"],

  run({msg,args,content}){
    const contents = content().substring(0,500);
    let emoList :emoji[] = [];
    let emojiReg = /<a?:\w{1,20}:\d{1,32}>/g;
    
    if(!args.length&&!msg.reference){
      msg.channel.send(msg.client.config.emojis.aha+' You were supposed to reference a message or pass emojiName as an argument to query.');
      return;
    }
    else if (emojiReg.test(contents)) {
      new Set(contents.match(emojiReg)).forEach(str=>{
        let parts = str
          .replace(/<|>/g ,'')
          .split(':');
        emoList.push({
          animated:!!parts[0].length,
          name:parts[1],
          id: parts[2],
          guild: msg.client.emojis.cache.find(e =>
            e.id == parts[2])?.guild?.name,
        })
      })
      new pageView(msg,emoList.map(e=>embedIt(e)));
    } 
    else if(/^\d+$/.test(args[0]) && args[0].length<33){
      const emo = msg.client.emojis.resolve(args[0]);
      const emote = {
        id : args[0],
        name : emo?.name,
        animated : emo?.animated,
        guild : emo?.guild?.name
      } // { // }
      if (!emo) {
        fetch(`https://cdn.discordapp.com/emojis/${args[0]}.gif`)
          .then((resp) => {
            if (resp.status == 200) {
              emote.animated = true;
              msg.channel.send({embeds:[embedIt(emote)]});
            }
            else {
              fetch(`https://cdn.discordapp.com/emojis/${args[0]}.png`)
                .then((resp) =>{
                  if(resp.status==200){
                    emote.animated = false;
                    msg.channel.send({embeds:[embedIt(emote)]});

                  }
                  else{
                    msg.reply('your Specified emoji not Found!')
                  }
                })
            }
          });
      } 
      else msg.channel.send({embeds:[embedIt(emote)]});

    }
    else if(args[0]?.length<21) {
      let emo = msg.client.emojis.cache.find(e=>
          e.name==args[0])||
        msg.client.emojis.cache.find(e =>
          new RegExp('^'+args[0],'i').test(e.name??''))
      
      if (emo)msg.channel.send({embeds:[embedIt({
          animated: emo.animated,
          name: emo.name,
          id: emo.id,
          guild: emo.guild.name
        })]});
      else msg.reply('your Specified emoji not Found!');
    }
    else if (msg.reference&&msg.reference.messageId) {
      msg.channel.messages.fetch(msg.reference.messageId).then((m)=>{
      new Set(m.content.match(emojiReg)).forEach((str)=>{
        let parts = str
          .replace(/<|>/g ,'')
          .split(':');
        emoList.push({
          animated:!!parts[0].length,
          name:parts[1],
          id: parts[2],
          guild: msg.client.emojis.cache.find(e =>
          e.id == parts[2])?.guild?.name,
        })
      });
      if(!emoList.length){
        msg.reply('Reference messages dosent contain any resolvable emojies!');
        return;
      }
      new pageView(msg,emoList.map(e=>embedIt(e)));
    });}

    else msg.reply('your Specified emoji not Found!');
  }
}



function embedIt(emote:emoji) {
  return new MessageEmbed({
    color : '#000000',
    title:`Emoji ${emote.name||emote.id}.${(emote.animated)?'gif':'png'}`,
    url :`https://cdn.discordapp.com/emojis/${emote.id}.${(emote.animated)?'gif':'png'}`,
    image : {
        url : `https://cdn.discordapp.com/emojis/${emote.id}.${(emote.animated)?'gif':'png'}`,
    },
    description : '```js\n'+`Name : ${emote.name??'unknown'
      }\nID : ${emote.id
      }\nAnimated : ${emote.animated??false
      }\nGuild : ${emote.guild??'unknown'} `+'```',
  });
}

interface emoji {
  name?: string|null,
  id : string,
  animated?: boolean|null,
  guild?: string|null
}
