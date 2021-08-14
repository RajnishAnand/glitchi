import { argumentObjectType, message } from '../types';
import {TextChannel} from 'discord.js';
//import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  async main(args:string[]){
    this.msg.react(global.config.emojis.quick);
    let channel:TextChannel|undefined, messageID:string|undefined|null;
    
    //Checks for channel and msg id
    if(!this.msg.reference&&!args.length){
      this.msg.reply(global.config.emojis.aha+' Looks like you forgot to enter Message Id');
      return;
    }
    if(!args.length ){
      channel = this.msg.channel;
      messageID = this.msg.reference?.messageID;
    }
    else if (args.length >= 2) {
      let chID = args[0]
        .replace(/^<#/, '')
        .replace(/>$/, '')
      messageID = args[1];
      if (!/^\d+$/.test(chID)) return this.msg
        .reply(`unable to resolve \`${args[0]}\` as channel.`);
      if(!/^\d+$/.test(messageID)) return this.msg
        .reply(`unable to resolve \`${args[1]}\` as messageID`);
      channel = this.msg.client.channels.cache.get(chID) as TextChannel;
      if(!channel)return this.msg.reply('unable to resolve channel.');
    }
    
    else {
      if(!/^\d+$/.test(args[0])) return this.msg
        .reply(`unable to resolve \`${args[0]}\` as messageID`);
      messageID = args[0];
      channel = this.msg.channel;
    }
    
     if(!messageID||!channel)
      return this.msg.channel.send('Error getting content!');
    //console.log(channel)
    let messages = channel.messages;
    if(messages){
      messages.fetch(messageID)
        .then((m0)=>
          this.msg.channel.send(m0.content,{code:true})
            .then((m1:message)=>{if('```\n'+m0.content+'\n```'!==m1.content){
              m1.edit(
                m0.content.replace(/</g,'<­').replace(/```/g,'`­``'),
                {code:true}
              )
            }})
        )
        .catch((err: Error)=>this.msg.reply(err.message));
    }
    else{
      this.msg.reply(`message with id \`${messageID}\` not Found!`);
    };
    
  };
}

export default {
  name: 'content',
  description: 'content of message',
  aliases:['c'],
  usage: '[optional :#channel or channelID] [messageID] ',
  // args:boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}

