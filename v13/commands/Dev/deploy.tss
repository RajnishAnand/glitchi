import { argumentObjectType } from '../types';
import slashDeploy from '#libs/slash-deploy.js';
import slashCommands from '#libs/slash-handler.js';
import {User,Guild } from 'discord.js';

export default {
  name : 'deploy',
  description : 'to deploy slash commands',
  //requiredPerms : string[],
  userPerms : ['ADMINISTRATOR'],
  //devOnly : true,
  
  run({msg,args}:argumentObjectType){
    let json :Array<any>;
    if(!args.length)json=slashCommands.map(c=>c.data);
    else {
      // if(!slashCommands.get(args[0]))
      json=slashCommands
        .filter((_,i)=>args.includes(i))
        .map(c=>c.data);
      if(!json.length)return msg.reply('`'+args.join(', ')+'` not found!');
      // json = [(slashCommands.get(args[0]) as any).data];
      
    };
    slashDeploy(
        (msg.client.user as User).id,
        (msg.guild as Guild).id
        ,json).then(m=>{
      if(m==200){
        msg.reply('Slash commands successfully deployed!');
      }
      else{
        msg.reply('Something went wrong!');
      }
    })
  }
}