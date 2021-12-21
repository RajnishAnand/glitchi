import { argumentObjectType } from '../types';
import userdb from '#libs/firebase.js';
import fetch from 'node-fetch';

export default{
  name : 'set',
  description : 'to set configuration',
  args: false,
  // usage : string,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  run
}

function run({msg,args}:argumentObjectType) {
  if(args[0]=='sololearn'){
    if(!args[1] || !/^\d*$/.test(args[1])) 
      return msg.reply('Invalid ID');
    fetch(process.env.API0+'/user/'+args[1])
      .then(r=>r.json())
      .then(obj=>{
        if(!obj.getProfile)return msg.reply('Invalid ID');
        userdb.child(msg.author.id+'/sololearn')
          .set(args[1])
          .then(()=>msg.reply('Suscessfully saved your sololearn id.'))
          .catch(()=>msg.reply('Err while saving ur sololearn id.'))
      })
      .catch(()=>msg.reply('An Unknown Error Occurred!'))
  }
  
}


