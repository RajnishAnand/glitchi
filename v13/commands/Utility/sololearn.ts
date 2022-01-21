import pageView from '#libs/pagination';
import userdb from '#libs/firebase.js';
import {hotToday, trending, user} from '#api/@sololearn';
import {Command, CommandArgument} from 'Interfaces';


export const command:Command= {
  name : 'sololearn',
  description : 'sololearn',
  aliases : ['sl'],
  usage : '<profile||user||hot||trend> ?<userId||@user>',

  examples : ['profile','user','hot','trend'],
  run
}

async function run({msg,args}:CommandArgument){
  if (args[0]?.toLowerCase() =='user'||args[0]?.toLowerCase() =='profile'){
    args[1]=args[1].replace(/^<@!?/, '').replace(/>$/, '');
    if(!args[1]) await userdb.child(msg.author.id+'/sololearn').once('value',d=>{args[1]=d.val()});
    if(!args[1]|| !/^\d*$/.test(args[1]))
      return msg.reply('Your sololearn id not found. Please configure it using \n`'+msg.client.config.prefix+'set sololearn <id>`');
    if(args[1].length>10&&args[1].length<20)await userdb.child(args[1]+'/sololearn').once('value',d=>{args[1]=d.val()});

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

