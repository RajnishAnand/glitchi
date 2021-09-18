import {GuildMember} from 'discord.js';
import {argumentObjectType} from '../types';

export default {
  name : 'ban',
  description : 'ban a user',
  usage : '[@user || id]',
  args : true,
  permissions : ['BAN_MEMBERS'],
  
  run({msg,args}:argumentObjectType){
    const userID=args[0].replace(/^<@!?/,'').replace(/>$/,'');
            
    if(!/^\d+$/.test(userID))
      this.msg.reply(`can't resolve \`${args[0]}\` as a user!`);
    else if(userID==this.msg.client.user?.id){
      this.msg.react(global.config.emojis.nono).catch(()=>null);
      this.msg.reply('you are trying to make me ban myself ‽');
    }
    
    else this.msg.guild?.members.fetch(userID).then((user:GuildMember)=>{
      if(!user.bannable){
        this.msg.reply(`Unable to ban ${user.user.tag}, has permissions same or greater than me.`);
      }
      else{
        user.ban()
          .then(()=>{
            this.msg.react(global.config.emojis.evilLaugh);
            this.msg.channel.send(global.config.emojis.evilAttack);
            this.msg.channel.send(`${user.user.tag}, was successfully banned!`);
          })
          .catch((err)=>this.msg.reply('Unable to ban this user. `code : '+err.code+'`'));
      }
    }).catch((err)=>{
      if(err.code==10013)this.msg.reply(`Are you sure user with id \`${userID}\` is a valid member of this guild! `+global.config.emojis.think)
    });
  }

}