const info = require('../../config.json').info;

module.exports = {
  name : 'avatar',
  aliases:['pfp','a'],
  description : 'User Avatar',
  args : false,
  execute(msg,args,client){
    let userIDs = new Array;
    if(args.length){args.forEach(arg=>{
        arg = arg.replace(/^<@/,'').replace(/>$/,'');
        if(parseInt(arg)==arg)userIDs.push(arg);
        else{
          //userIDs.push(msg.author.id);
          msg.channel.send(`can't resolve \`${arg}\` as a User!`);
        }
      });}
    else{
      userIDs.push(msg.author.id);
    };
    userIDs.forEach(id=>{
      client.users
        .fetch(id)
        .then(u=>sendEmbedAvatar(u,msg.channel))
        .catch(err=>msg.channel.send(`can't resolve \`${id}\` as a User!`));
    });
  }
};

function sendEmbedAvatar(user,channel){
  try{
  channel.send({embed:{
        'color':'#00bfff',
        'title':user.username+'#'+user.discriminator,
        'image' :{
          url: `${user.displayAvatarURL({
            format : 'png',
            dynamic : 'true',
          })}?size=2048`,
        },
        'timestamp': new Date(),
        'footer':info,
      }});
  }
  catch(err){channel.send(err.message)};
}