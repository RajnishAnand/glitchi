const info = require('../../config.json').info;

module.exports = {
  name : 'avatar',
  description : 'User Avatar',
  args : false,
  execute(msg,args){
    if(args.length){
        if(msg.mentions.users.size){
          msg.channel.send({embed:{
            'color': '#00bfff',
            'title':msg.mentions
                .users.first().username+'#'+
              msg.mentions
                .users.first().discriminator,
            'image':{
                url:msg
                  .mentions
                  .users
                  .first()
                  .displayAvatarURL({
                    format : 'png',
                    dynamic : 'true',
                  })+'?size=2048',
            },
            'timestamp': new Date(),
            'footer':info,
          }});
        };
    }
    else{
      msg.channel.send({embed:{
        'color':'#00bfff',
        'title':msg.author.username+'#'+msg.author.discriminator,
        'image' :{
          url: `${msg.author.displayAvatarURL({
            format:'png',
            dynamic:true,
          })}?size=2048`,
        },
        'timestamp': new Date(),
        'footer':info,
      }});
    };
  }
};