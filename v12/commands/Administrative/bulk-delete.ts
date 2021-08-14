import { argumentObjectType, message } from '../types';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  main(args:string[]){
    if (this.msg.channel.type == 'dm')return;
    this.msg.react(global.config.emojis.quick);
    let amount = parseInt(args[0]);
    
    if(!isNaN(amount)){
      if(amount<0){
        this.msg.channel.send(global.config.emojis.aha+' Aha you are trying pass a negative number.');
        return;
      }
      const times = Math.floor(amount/100);
      const extra = amount - times*100;
      let force = false;
      if(args[args.length-1]=='--force')force=true;
      for(let i=0;i<times;i++){
        this.msg.channel.bulkDelete(100,!force)
        .catch((err:Error)=>this.msg.channel.send(err.message));
      }
      if(extra)this.msg.channel.bulkDelete(extra,!force)
        .catch((err:Error)=>this.msg.channel.send(err.message));
      this.msg.channel.send('Successfully deleted '+amount+' messages!');
    }
    else{
      this.msg.channel.send(`Unable to resolve ${args[0]} as Integer!`);
    };
  }
}

export default{
  name : 'bulk-delete',
  description : 'bulk message delete',
  aliases : ['prune','purge'],
  args : true,
  permissions : 'MANAGE_MESSAGES',
  // usage : string,
  // permRequired : [string],
  run
}