const {channels,emojis}= require('../../config.json');
module.exports={  
  name: 'feedback',
  description: 'Send feedback',
  aliases: ['fd', 'suggest'],
  usage: '[feedback]',
  args : true,
  execute({msg, args ,error}){
    //Feedback
    const feedback = args.join(" ")
      //.replace(/\n+/,'\n');
      .replace(/\n{2,}/g, '\n');
    //Embed object
    let embed = {
      title : `📮| Feedback : `,
      color : '#1ac95d',
      description : '>>> '+feedback,
      fields : [{
        name : '🥷| Userinfo : ',
        value : '```\n'+`Username : ${msg.author.tag
          }\nID : ${msg.author.id
          }\nGuild : ${msg.guild.name
          }`+'```',
      }],
      timestamp : new Date(),
    };
    //msg.delete();
    msg.client.channels.cache.get(channels.feedback).send({embed})
      .then(msg => {
        msg.react(emojis.thumbsup);
        msg.react(emojis.thumbsdown);
    }).catch((err) => {
        msg.channel.send('There was an error while sending your Feedback!')
        error(msg,err);
    }).then(()=>
      msg.channel.send('Thank you for your Feedback! Your feedback was successfully sent to support server.\😊') 
    );
  },
}