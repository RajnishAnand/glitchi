import {pageView} from "../../libs";
import {Command} from "Interfaces";

export const command :Command= {
  name: 'content',
  description: 'content of message',
  aliases:['c'],
  usage: '<#channel|channelID|messageID> ?<messageID>',

  async run({msg,args}){
    let channel: typeof msg.channel|undefined;
    let messageID :string|undefined;
    
    //Check for channel and msg id
    if(!msg.reference?.messageId&&!args.length){
      msg.reply(msg.client.config.emojis.aha+' Looks like you forgot to enter Message Id');
      return;
    }
    if(!args.length ){
      channel = msg.channel;
      messageID = msg.reference?.messageId;
    }
    else if (args.length >= 2) {
      let chID = args[0]
        .replace(/^<#/, '')
        .replace(/>$/, '')
      messageID = args[1];
      if (!/^\d+$/.test(chID)) return msg
        .reply(`unable to resolve \`${args[0]}\` as channel.`);
      if(!/^\d+$/.test(messageID)) return msg
        .reply(`unable to resolve \`${args[1]}\` as messageID`);
      msg.client.channels.fetch(chID).then(c=>{
        if(c?.isText&&c.type=="GUILD_TEXT")channel = c;
      });
      if(!channel)return msg.reply('unable to resolve channel.');
    }
    
    else {
      if(!/^\d+$/.test(args[0])) return msg
        .reply(`unable to resolve \`${args[0]}\` as messageID`);
      messageID = args[0];
      channel = msg.channel;
    }
    
     if(!messageID||!channel)
      return msg.channel.send('Error getting content!');
    //console.log(channel)
    let messages = channel.messages;
    if(messages){
      messages.fetch(messageID)
        .then((m0)=>{new pageView(msg,{
          content : m0.content,
          embed : JSON.stringify(m0.embeds,null,'  ')
        })})
    }
    else{
      msg.reply(`message with id \`${messageID}\` not Found!`);
    };
    
  }

}

