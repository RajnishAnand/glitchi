import util from 'util';
import {pageView} from '#libs';
import {Command} from 'Interfaces';

export const command: Command = {
  name: 'eval',
  aliases: ['ev'],
  description: 'Evaluate',
  devOnly: true,
  args: true,
  // usage : string,
  // permissions : string,
  // permRequired : [string],
  run ({msg,content}){
    try {
      if (msg.author.id === msg.client.guilds.cache.get(msg.client.config.guildId)?.ownerId) {
        const client = msg.client;
        // const db=()=>{firebase.once("value",(d)=>send(d.val()))};
        const send=(text:string, bool:boolean=false)=>{
          if(bool)new pageView(msg,text);
          else new pageView(msg,debug(text),
          {
            code:'javascript',
            title:'JS-OUTPUT',
            timestamp:new Date(),
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
  } 
}


//To replace '<' & '`' character
function  debug(evaled:string) {
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
}

