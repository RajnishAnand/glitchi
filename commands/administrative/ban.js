module.exports = {
  name : 'ban',
  description : 'ban a user',
  usage : '[@user]',
  args : true,
  permissions : 'BAN_MEMBERS',
  execute({msg,args}){
    const user = msg.mentions.users.first();
    if(user){
      msg.guild.members.ban(user)
        .then(m=>{
          msg.react('854700368126541834');
          msg.channel.send('<:voldyAttack:853598830632763432>');
          msg.channel.send(`${user.username} #${user.discriminator}, was successfully banned!`);
        })
        .catch(err=>msg.reply(err.message));
    }
  }
}