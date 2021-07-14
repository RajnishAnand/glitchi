module.exports = {
  name: 'avatar',
  aliases: ['pfp', 'a'],
  description: 'User Avatar',
  usage: '[optional : @user or userID]',
  args: false,
  cooldown: 3,
  execute({msg,args,error}:any) {
    msg.react('856818054602948608');
    let userIDs = new Array;
    if (args.length) {
      args.forEach((arg:string )=> {
        arg = arg.replace(/^<@!?/, '').replace(/>$/, '');
        if (Number(arg)!==NaN) userIDs.push(arg);
        else {
          //userIDs.push(msg.author.id);
          msg.channel.send(`can't resolve \`${arg}\` as a User!`);
        }
      });
    }
    else {
      userIDs.push(msg.author.id);
    };
    userIDs = userIDs.slice(0, 2);
    userIDs.forEach((id:string) => {
      msg.client.users
        .fetch(id)
        .then((u:any) =>
          sendEmbedAvatar(u, msg.channel,msg,error))
        .catch((err:any) => {
          error(msg,err);
          msg.channel.send(`can't resolve \`${id}\` as a User!`)
        });
    });
  }
};

function sendEmbedAvatar(user:any, channel:any,msg:any,error:any) {
  try {
    channel.send({
      embed: {
        'color': `#00bfff`,
        'title': user.tag,
        'image': {
          url: `${user.displayAvatarURL({
            format : 'png',
            dynamic : 'true',
          })}?size=4096`,
        },
        'timestamp': new Date(),
        'footer':{
          text: 'Requested by '+msg.author.username,
          icon_url:msg.author.avatarURL({format:'png'})
        },
      }
    });
  }
  catch (err) { 
    error(msg,err);
    channel.send(err.message);
  };
}