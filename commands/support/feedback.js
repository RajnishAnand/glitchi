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
    let embed = {
      title : `📮| Feedback : `,
      color : '#1ac95d',
      description : '```\n'+content+'```',
      fields : [{
        name : '🥷| Userinfo : ',
        value : '```\n'+`Username : ${msg.author.tag
          }\nID : ${msg.author.id
          }\nGuild : ${msg.guild.name
          }`+'```',
      }],
      timestamp : new Date(),
    }
    //msg.delete();
    msg.client.channels.cache.get(channelID).send({embed})
      .then(msg => {
        msg.react("👍")
        msg.react("👎")
    }).catch(() => {
        console.log("error while reacting to message");
     });
    msg.channel.send("Feedback sent ✅!") ;
  },
}
