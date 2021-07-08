const { RichEmbed } = require('discord.js');

module.exports={  
  name: 'feedback',
  description: 'Send your feedback directly to the developer',
  aliases: ['fd', 'suggest'],
  usage: '[give feedback]',
  execute(client, message, args) {
    
    //support server and feedback channel respectively
    const serverID = "856090036998635520"; 
    const channelID = "856907506612830241";
    
    //check for empty feedbacks
    if(!args.join(" ")) return message.channel.send("Specify a feedback please!");
    let feedback = args.join(" ");
    
    let embed = new RichEmbed()
    .setTitle("Feedback")
    .setColor("Green")
    .setDescription(args.join(" "))
    .addField('Author:', message.author)
    .addField('From server:', message.guild.name)
    .setTimestamp(new Date())
    message.delete()
    message.channel.send("Feedback sent ✅!")
    client.guilds.get("856090036998635520").channels.get("856907506612830241").send(embed);
  },
}
