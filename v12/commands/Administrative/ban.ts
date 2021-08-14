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
      this.msg.reply('you are trying to make me ban myself.');
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
    });
  }
}

export default {
  name : 'ban',
  description : 'ban a user',
  usage : '[@user]',
  args : true,
  permissions : 'BAN_MEMBERS',
  permRequired : ['BAN_MEMBERS'],
  run
}
