import {Command} from 'Interfaces';
import {firebase,select,ask} from '#libs';
import fetch from 'node-fetch';

export const command: Command = {
  name : 'set',
  description : 'to set configuration',
  usage : '?<sololearn> ?<sololearn_ID>',

  async run({msg,args}){
    if(!args.length){
      try{
        args[0] = await select(msg,{
          title:'Select option you want to configure.',
          options : [{
            label : 'Sololearn',
            description : 'set sololearn ID',
            value : 'sololearn'
          }]
        });
      }catch(err:any){
        if('message' in err)msg.reply({
          content : err.message,
          failIfNotExists:false
        });
        return;
      }
    }

    if(args[0]=='sololearn'){
      if(!args[1]){
        const answer = await ask(msg,'Please enter your Sololearn id :')
        if(!answer)return msg.reply({
          content : '⛔ Command Cancelled!',
          failIfNotExists : false
        });
        args[1]=answer;
      };
      if(await verifySololearnUser(args[1])){
        firebase.child(msg.author.id+'/sololearn')
         .set(args[1])
         .then(()=>msg.reply({
           content : msg.client.config.emojis.salute+' Successfully saved your sololearn id.',
           failIfNotExists : false
         }))

         .catch(()=>msg.reply({
           content :'Err while saving ur sololearn id.',
           failIfNotExists:false
         }));
      }
      else{
        msg.reply({
          content:'Invalid ID',
          failIfNotExists : false
        });
      }
    }
    else msg.reply({
      content:`Unknown command argument. Type \`${msg.client.config.prefix}help set\` to get help on it.`,
          failIfNotExists : false
    });

  }
}


async function verifySololearnUser(id:string){
  if(!/^\d*$/.test(id))return false;
  else return await fetch(process.env.API0+'/user/'+id)
    .then(r=>r.json())
    .then(obj=>!!obj.getProfile);
}


