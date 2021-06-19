module.exports = {
  name : 'unban',
  description : 'unban a user',
  usage : '[userID]',
  args : true,
  permissions : 'BAN_MEMBERS',
  execute({msg,args}){
    msg.guild.members.unban(args[0])
      .then(m=>{
        msg.channel.send(`user with id :${730885117656039466}, was successfully unbanned!`);
      })
      .catch(err=>{
        if(err.code==10026){
          msg.reply('user is already unbanned!');
        }
        else{
          msg.channel.send(err.message);
        }
      });
  }
};