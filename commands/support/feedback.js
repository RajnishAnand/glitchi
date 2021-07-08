module.exports={  
  name: 'feedback',
  description: 'Send feedback',
  aliases: ['fd', 'suggest'],
  usage: '[feedback]',
  args : true,
  execute({msg, args, content}){
    //support server and feedback channel respectively
    const channelID = "856907506612830241";
    
    //check for empty feedbacks
    let embed = new Discord.msgEmbed()    
      .setTitle("Feedback")
      .setColor("Green")
      .setDescription(content)
      .addField('Author : ', msg.author)
      .addField('From server : ', msg.guild.name)
      .setTimestamp(new Date())
    msg.delete();
    msg.channel.send("Feedback sent ✅!") ;
    msg.client.channels.get(channelID).send(embed);
  },
}
