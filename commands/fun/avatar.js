const info = require('../../config.json').info;

module.exports = {
  name : 'avatar',
  aliases:['pfp','a'],
  description : 'User Avatar',
  args : false,
  execute(msg,args,client){
    let user;
    if(args.length){
       if(msg.mentions.users.size){
          user = msg.mentions.users.first();
        }
        else{
          user = msg.author;
          try{
            //user = client.users.cache.get(args[0]);
            //msg.channel.send($;
            //client.username='Testbot';
          }
          catch(err){
            //msg.channel.send(err.message);
          }
        };
    }
    else{
      user = msg.author;
    };
    msg.channel.send({embed:{
        'color':'#00bfff',
        'title':user.username+'#'+user.discriminator,
        'image' :{
          url: `${user.displayAvatarURL({
            format:'png',
            dynamic:true,
          })}?size=2048`,
        },
        'timestamp': new Date(),
        'footer':info,
      }});
  }
};