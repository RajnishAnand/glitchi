import { argumentObjectType, message } from '../types';
import fetch from 'node-fetch';
import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  async main(args:string[]){
    const content= args.join(' ').substr(0,500);
    let emoList :emoji[] = new Array;
    let emojiReg = /<a?:\w{1,20}:\d{1,32}>/g;
    
    if(!args.length&&!this.msg.reference){
      this.msg.channel.send(global.config.emojis.aha+' Aha! you just sent an empty argument.');
      return;
    }
    else if (emojiReg.test(content)) {
      new Set(content.match(emojiReg)).forEach(str=>{
        let parts = str
          .replace(/<|>/g ,'')
          .split(':');
        emoList.push({
          animated:!!parts[0].length,
          name:parts[1],
          id: parts[2],
          guild: this.msg.client.emojis.cache.find(e =>
          e.id == parts[2])?.guild?.name,
        })
      })
      pageView(this.msg,emoList.map(e=>this.embedIt(e)));
    }
    else if (/^\d+$/.test(args[0])&& args[0].length<33) {
      let emo = this.msg.client.emojis.resolve(args[0]);
      let emote = {
        id : args[0],
        name : emo?.name,
        animated : emo?.animated,
        guild : emo?.guild?.name,
      }
      if (!emo) {
        fetch(`https://cdn.discordapp.com/emojis/${args[0]}.gif`)
          .then((resp) => {
            if (resp.status == 200) {
              emote.animated = true;
              this.msg.channel.send({embed:this.embedIt(emote)});
            }
            else {
              fetch(`https://cdn.discordapp.com/emojis/${args[0]}.png`)
                .then((resp) =>{
                  if(resp.status==200){
                    // this.send(emote))
                    emote.animated = false;
                    this.msg.channel.send({embed:this.embedIt(emote)});

                }
                else{
                  this.msg.reply('your Specified emoji not Found!')
                }
                })
            }
          });
      } 
      else this.msg.channel.send({embed:this.embedIt(emote)});

    }
    else if(args[0]?.length<21) {
      let emo = this.msg.client.emojis.cache.find(e=>
          e.name==args[0])||
        this.msg.client.emojis.cache.find(e =>
          new RegExp('^'+args[0],'i').test(e.name))
      
      if (emo)this.msg.channel.send({embed:this.embedIt({
          animated: emo.animated,
          name: emo.name,
          id: emo.id,
          guild: emo.guild.name
        })});
      else this.msg.reply('your Specified emoji not Found!');
    }
    else if (this.msg.reference) {
      this.msg.channel.messages.fetch(this.msg.reference.messageID).then((m:message)=>{
      new Set(m.content.match(emojiReg)).forEach((str)=>{
        let parts = str
          .replace(/<|>/g ,'')
          .split(':');
        emoList.push({
          animated:!!parts[0].length,
          name:parts[1],
          id: parts[2],
          guild: this.msg.client.emojis.cache.find(e =>
          e.id == parts[2])?.guild?.name,
        })
      });
      if(!emoList.length){
        this.msg.reply('Reference messages dosent contain any resolvable emojies!');
        return;
      }
      pageView(this.msg,emoList.map(e=>this.embedIt(e)));
    });}

    else this.msg.reply('your Specified emoji not Found!');
  }
  
  embedIt(emote:emoji) {
    return{
      color : '#000000',
      title:`➟ emoji : [${emote.name||emote.id}]`,
      url :`https://cdn.discordapp.com/emojis/${emote.id}.${(emote.animated)?'gif':'png'}`,
      image : {
          url : `https://cdn.discordapp.com/emojis/${emote.id}.${(emote.animated)?'gif':'png'}`,
      },
      description : '```js\n'+`Name : ${emote.name??'uknown'
        }\nID : ${emote.id
        }\nAnimated : ${emote.animated??false
        }\nGuild : ${emote.guild??'uknown'} `+'```',
      };
  }

}

export default {
  name: 'info-emoji',
  aliases: ['infomoji', 'imo'],
  description: 'emoji image with details',
  usage : '[<id> or <querry> or <emoji>]',
  // args: boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}

interface emoji {
  name ?: string,
  id : string,
  animated ?: boolean,
  guild?:string
}