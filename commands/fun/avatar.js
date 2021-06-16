const {info} = require('../../config.json');

module.exports = {
  name : 'avatar',
  aliases:['pfp','a'],
  description : 'User Avatar',
  usage : '[optional : @user or userID]',
  args : false,
  cooldown:3,
  execute({msg,args,client}){
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
    userIds=userIds.substr(0,2);
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