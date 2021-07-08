module.exports = {
  name: 'avatar',
  aliases: ['pfp', 'a'],
  description: 'User Avatar',
  usage: '[optional : @user or userID]',
  args: false,
  cooldown: 3,
  execute({msg,args,error}) {
    msg.react('856818054602948608');
    let userIDs = new Array;
    if (args.length) {
      args.forEach(arg => {
        arg = arg.replace(/^<@!?/, '').replace(/>$/, '');
        if (parseInt(arg) == arg) userIDs.push(arg);
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
    userIDs.forEach(id => {
      msg.client.users
        .fetch(id)
        .then(u =>
          sendEmbedAvatar(u, msg.channel,msg,error))
        .catch(err => {
          error(msg,err);
          msg.channel.send(`can't resolve \`${id}\` as a User!`)
        });
    });
  }
};

function sendEmbedAvatar(user, channel,msg,error) {
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