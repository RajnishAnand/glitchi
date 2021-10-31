import {argumentObjectType} from '../types';
import util from 'util';
import pageView from '../../libs/pagination';
import {commands} from '../../libs/command-handler.js';


export default {
  name: 'eval',
  aliases: ['ev'],
  description: 'Evaluate',
  devOnly: true,
  args: true,
  // usage : string,
  // permissions : string,
  // permRequired : [string],
  run ({msg,content}:argumentObjectType){
    try {
      if (msg.author.id === global.config.ownerId) {
        const send=(text:string, bool:boolean=false)=>{
          if(bool)new pageView(msg,text);
          else new pageView(msg,this.debug(text),
          {
            code:'javascript',
            title:'JS_OUTPUT',
            timestamp:Date.now(),
            chunkSize : 700
          });
          return '<pagination>';
        }
        send(eval(content()));
      }
      else {
        msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
      }
    }
    catch (err:any) {
      msg.channel.send('```\n'+err.message+'```');
    };
  },
  
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
    catch (err:any) {
      return err.message;
    }
  },
  
  // async del(){
  //   if(!this.msg.reference)return;
  //   const m = await this.msg.channel.messages.fetch(this.msg.reference?.messageID);
  //   return m.delete();
  // }

}