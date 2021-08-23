import { argumentObjectType, message } from '../types';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  main(args:string[]){
    const userID=args[0].replace(/^<@!?/,'').replace(/>$/,'');
    if(!/^\d+$/.test(userID)) return this.msg.reply(global.config.emojis.evil+' Are you sure its a valid user!')
    
    this.msg.guild.members.unban(userID)
      .then(()=>{
        this.msg.react(global.config.emojis.yus);
        this.msg.channel.send(`user with id :${userID}, was successfully unbanned!`);
      })
      .catch((err)=>{
        if(err.code==10026)
          this.msg.reply(global.config.emojis.aha+'You are trying to ban a user which is already unbanned!');
        else if (err.code==10013)this.msg.reply(global.config.emojis.evil+' Are you sure its a valid user!');
        else this.msg.channel.send(err.message);
      });
  }
}

export default{
  name : 'unban',
  description : 'unban a user',
  usage : '[userID]',
  args : true,
  permissions : ['BAN_MEMBERS'],
  run
}