module.exports = {
  name : 'ban',
  description : 'ban a user',
  usage : '[@user]',
  args : true,
  permissions : 'BAN_MEMBERS',
  permRequired : ['BAN_MEMBERS'],
  execute({msg,args}){
    const userID = args[0]
            .replace(/^<@!?/,'')
            .replace(/>$/,'');
            
    if(userID*0!==0){
      msg.reply(`can't resolve \`${args[0]}\` as a user!`);
    }
    else if(userID==msg.client.user.id){
      msg.react('831705934648573982');
      msg.reply('you are trying to make me ban myself.');
    }
    else msg.guild.members.fetch(userID).then(user=>{
      if(!user.bannable){
        msg.reply(`Unable to ban ${user.user.tag}, has permissions same or greater than me.`);
      }
      else{
        user.ban()
          .then(m=>{
            msg.react('854700368126541834');
            msg.channel.send('<:voldyAttack:853598830632763432>');
            msg.channel.send(`${user.user.tag}, was successfully banned!`);
          })
          .catch(err=>msg.reply('Unable to ban this user. `code : '+err.code+'`'));
          
      }
      
    });
    
  }
}

