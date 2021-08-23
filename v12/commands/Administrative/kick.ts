import {GuildMember} from 'discord.js';
import {argumentObjectType, message} from '../types';

class run {
  declare msg: message;
  constructor({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args);
  };
  
  main(args:String[]){
    const userID=args[0].replace(/^<@!?/,'').replace(/>$/,'');
            
    if(!/^\d+$/.test(userID))
      this.msg.reply(`can't resolve \`${args[0]}\` as a user!`);
    else if(userID==this.msg.client.user?.id){
      this.msg.react(global.config.emojis.nono).catch(()=>null);
      this.msg.reply('you are trying to make me kick myself ‽');
    }
    
    else this.msg.guild?.members.fetch(userID).then((user:GuildMember)=>{
      if(!user.kickable){
        this.msg.reply(`Unable to kick ${user.user.tag}, has permissions same or greater than me.`);
      }
      else{
        user.kick()
          .then(()=>{
            this.msg.react(global.config.emojis.evilLaugh);
            this.msg.channel.send(global.config.emojis.evilAttack);
            this.msg.channel.send(`${user.user.tag}, was successfully kicked out of the server!`);
          })
          .catch((err)=>this.msg.reply('Unable to kick this user. `code : '+err.code+'`'));
      }
    }).catch((err)=>{
      if(err.code==10013)this.msg.reply(`Are you sure user with id \`${userID}\` is a valid member of this guild! `+global.config.emojis.think)
    });
  }
}

export default {
  name : 'kick',
  description : 'kick a user',
  usage : '[@user || id]',
  args : true,
  permissions : ['KICK_MEMBERS'],
  run
}