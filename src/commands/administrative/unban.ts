module.exports = {
  name : 'unban',
  description : 'unban a user',
  usage : '[userID]',
  args : true,
  permissions : 'BAN_MEMBERS',
  execute({msg,args}:any){
    msg.react('855443444399210496');
    msg.guild.members.unban(args[0])
      .then((m:any)=>{
        msg.channel.send(`user with id :${730885117656039466}, was successfully unbanned!`);
      })
      .catch((err:any)=>{
        if(err.code==10026){
          msg.reply('user is already unbanned!');
        }
        else{
          msg.channel.send(err.message);
        }
      });
  }
};