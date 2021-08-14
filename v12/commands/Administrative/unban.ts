import { argumentObjectType, message } from '../types';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  main(args:string[]){
    this.msg.react(global.config.emojis.yus);
    this.msg.guild.members.unban(args[0])
      .then(()=>{
        this.msg.channel.send(`user with id :${730885117656039466}, was successfully unbanned!`);
      })
      .catch((err)=>{
        if(err.code==10026){
          this.msg.reply('user is already unbanned!');
        }
        else{
          this.msg.channel.send(err.message);
        }
      });
  }
}

export default{
  name : 'unban',
  description : 'unban a user',
  usage : '[userID]',
  args : true,
  permissions : 'BAN_MEMBERS',
  // permRequired : [string],
  run
}