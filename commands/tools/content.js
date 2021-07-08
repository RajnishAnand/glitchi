module.exports = {
  name: 'content',
  description: 'content of message',
  aliases:['c'],
  usage: '[optional :#channel or channelID] [messageID] ',
  args: true,
  execute({ msg, args }) {
    msg.react('856818054602948608');
    let channel, messageID;
    if (args.length >= 2) {
      let chID = args[0]
        .replace(/^<#/, '')
        .replace(/>$/, '');
      if (chID * 1 != chID) return msg
        .reply(`unable to resolve \`${args[0]}\` as channel.`);
      messageID = args[1];
      channel = msg.client.channels.cache.get(chID);
    }
    else {
      if(args[0]*1!=args[0]) return msg
        .reply(`unable to resolve \`${args[0]}\` as messageID`);
      messageID = args[0];
      channel = msg.channel;
    }
    if(messageID*1!=messageID) return msg
        .reply(`unable to resolve \`${messageID}\` as messageID`);
    
    //console.log(channel)
    let messages = channel.messages;
    if(messages){
      messages.fetch(messageID)
        .then(m0=>
          msg.channel.send(m0.content,{code:true})
            .then(m1=>{if('```\n'+m0.content+'\n```'!==m1.content){
              m1.edit(
                m0.content.replace(/</g,'<­'),
                {code:true}
              )
            }})
        )
        .catch(err=>msg.reply(err.message));
    }
    else{
      msg.reply(`message with id \`${messageID}\` not Found!`);
    };
    
  },
}