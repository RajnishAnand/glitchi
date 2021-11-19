import { argumentObjectType} from '../types';
import pageView from '../../libs/pagination';
import {hotToday, trending, user} from '../../APIs/@sololearn';

function run({msg,args}:argumentObjectType){
  
  if (args[0]=='user'){
    if(!args[1]|| !/^\d*$/.test(args[1]))
      return msg.reply('Please enter a vaild user id');
    return user(+args[1])
      .then(t=>new pageView(msg,t))
      .catch(err=>msg.reply(err.message));
  }
  
  if(args[0]=='hot')hotToday()
    .then(t=>new pageView(msg,t))
    .catch(()=>msg.reply('An Unknown Error Occured while getting hotToday codes!'));
    
  else trending()
    .then(t => new pageView(msg, t))
    .catch(() => msg.reply('An Unknown Error Occured while getting trending codes!'));
}

export default {
  name : 'sololearn',
  description : 'sololearn',
  aliases : ['sl'],
  usage : '[...query]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  // examples : ['AJAX','fetch'],
  run
}