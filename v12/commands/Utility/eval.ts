import { argumentObjectType, message } from '../types';
import util from 'util';
import pageView from '../../libs/pagination/index';
import {commands} from '../../libs/handler.js';


class run{
  declare msg: message;
  commands = commands;
  constructor ({msg,args,content}: argumentObjectType){
    this.msg = msg;
    this.main(content)
  }
  async main(content:string){
    try {
      if (this.msg.author.id === global.config.ownerId) {
        const msg = this.msg;
        const send=(text:string, bool:boolean=false)=>{
          if(bool) pageView(this.msg,text);
          else pageView(this.msg,{text:this.debug(text),code:'js'});
          return '<pagination_message>';
        }
        send(eval(content));
      }
      else {
        this.msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
      }
    }
    catch (err) {
      this.msg.channel.send(err.message, { code: true });
    };
  }
  
  //To replace '<' & '`' character
  debug(evaled:string) {
    try {
      if (typeof(evaled) === 'string') {
        evaled = evaled
          .replace(/</g, '<​')
          .replace(/```/g, '`​``');
      }
      return util.inspect(evaled);
    }
    catch (err) {
      return err.message;
    }
  }
  
  async del(){
    if(!this.msg.refrence)return;
    const m = await this.msg.channel.messages.fetch(this.msg.reference?.messageID);
    return m.delete();
  }
}

export default {
  name: 'eval',
  aliases: ['ev'],
  description: 'Evaluate',
  devOnly: true,
  args: true,
  // usage : string,
  // permissions : string,
  // permRequired : [string],
  run
}