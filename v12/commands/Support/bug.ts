import { argumentObjectType, message } from '../types';
import {EmbedObject} from '../../libs/pagination/index';
import {TextChannel} from 'discord.js';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args.join(' '))
  }
  async main(arg:string){
    if(!this.msg.reference&&!this.msg.content.length){
      this.msg.reply('Please add description about the bug!');
      return;
    }
    let embed :EmbedObject= {
      title : '🪛| Bug Report :',
      fields:new Array
    }
    if(arg.length)embed.description='>>> '+arg;
    if(this.msg.reference)await this.msg.channel.messages.fetch(this.msg.reference.messageID).then((m:message)=>{
        embed.fields?.push({
          name : '🌡| Referenced Message :',
          value:`­     └⊸ ID : [${this.msg.reference?.messageID}](https://discord.com/channels/${this.msg.guild.id}/${this.msg.channel.id}/${this.msg.reference?.messageID})\n`+(m.embeds.length?'```json'+`\n${JSON.stringify(m.embeds).replace(/```/g,'`­``')}}`+'```\n': `>>> ${m.content.substr(0,500)}`),
          inline:false
        })
    });
    embed.fields?.push({
      name : '🥷| Userinfo : ',
      value :`├⊶ Username : \`${this.msg.author.tag
          }\`\n├⊷ ID : \`${this.msg.author.id
          }\`\n├⊷ Guild : \`${this.msg.guild.name
          }\`\n└⊶ MID : [${this.msg.id}](https://discord.com/channels/${this.msg.guild.id}/${this.msg.channel.id}/${this.msg.id})`,
      inline:true,
    });
   (this.msg.client.channels.cache.get(global.config.channels.bugReport) as TextChannel).send({embed}).then((m)=>{Promise.all([
      m.react(global.config.emojis.thumbsup),
      m.react(global.config.emojis.thumbsdown),
      m.react('🪛'),
     ])})
   this.msg.channel.send(global.config.emojis.sneak+' Sorry for your inconvenience. Bug was successfully reported to support server and will be fixed soon!');
  }
}

export default {
  name : 'report',
  description :'send a bug report to support server',
  aliases:['bug'],
  usage : '↪reply:Message, [description]',
  args : false,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}