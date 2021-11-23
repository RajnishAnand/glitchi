import { argumentObjectType } from '../types';
import slashDeploy from '#libs/slash-deploy.js';
import slashCommands from '#libs/slash-handler.js';
import {User,Guild } from 'discord.js';

export default {
  name : 'deploy',
  description : 'to deploy slash commands',
  devOnly : true,
  run({msg,args}:argumentObjectType){
    let json :Array<any>;
    if(!args.length)json=slashCommands.map(c=>c.data);
    else {
      if(!slashCommands.get(args[0]))return msg.reply(args[0]+' not found!');
      json = [(slashCommands.get(args[0]) as any).data];
    };
    slashDeploy(
        (msg.client.user as User).id,
        (msg.guild as Guild).id
        ,json).then(m=>{
      if(m==200){
        msg.reply('successfully deployed!');
      }
    })
  }
}