import { argumentObjectType} from '../types';
import pageView from '#libs/pagination';
import userdb from '#libs/firebase.js';
import {hotToday, trending, user} from '#api/@sololearn';

async function run({msg,args}:argumentObjectType){
  if (args[0]?.toLowerCase() =='user'||
  args[0]?.toLowerCase() =='profile'){
    if(!args[1]) await userdb.child(msg.author.id+'/sololearn').once('value',d=>{args[1]=d.val()});
    if(!args[1]|| !/^\d*$/.test(args[1]))
      return msg.reply('Your sololearn id not found. Please configure it using \n`'+global.config.prefix+'set sololearn <id>`');
    return user(+args[1])
      .then(t=>new pageView(msg,t))
      .catch(err=>msg.reply(err.message));
  }
  
  if(args[0]?.toLowerCase()=='hot')hotToday()
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
  // args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['profile','user','hot','trend'],
  run
}