import util from 'util';
import config from '../../config.js';
import pageView from '../../libs/pagination/index';

module.exports = {
  name: 'eval',
  aliases: ['ev'],
  description: 'Evaluate',
  devOnly: true,
  args: true,
  execute({ msg,args,content,error, prefix }:any, client = msg.client) {
    try {
      if (msg.author.id === config.ownerId) {
        const send=(text:string|any[], bool:boolean=false)=>{
          if(bool) pageView(msg,text);
          else pageView(msg,this.debug(text));
          return '<pagination_message>';
        }
        send(eval(content));
      }
      else {
        msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
      }
    }
    catch (err) {
      msg.channel.send(err.message, { code: true });
    };
  },
  
  //To replace '<' & '`' character
  debug(evaled:string) {
    try {
      if (typeof(evaled) === 'string') {
        evaled = evaled
          .replace(/</g, '<​')
          .replace(/`/g, '`​');
      }
      return util.inspect(evaled);
    }
    catch (err) {
      return err.message;
    }
  },
}