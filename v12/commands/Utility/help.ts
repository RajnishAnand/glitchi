import { argumentObjectType, message,commandTemplate } from '../types';
import {commands} from '../../libs/handler.js';
import pageView,{EmbedObject} from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  async main(args:string[]){
    if(!args.length){
      let data:{[key:string]:string}= {};
      let cmnds = commands.filter((cmd:any)=>!cmd.devOnly).sort();
      for (let cmd of cmnds){
        if(!data[cmd[1].category])data[cmd[1].category]='';
        
        data[cmd[1].category]+=`‣ ${global.config.prefix}${cmd[1].name} ⇨ ${cmd[1].description}\n`
        
        if(cmd[1].clones){
          // console.log(cmd[1].clones)
          for(let c in cmd[1].clones)data[cmd[1].category]+=`‣ ${global.config.prefix}${c} ⇨ ${cmd[1].clones[c].description}\n`
        }
      }
      pageView(this.msg,Object.keys(data).map((m:string)=>{
        return {title:m,description:data[m],color:'#00bfff'}}));
    }
    else this.msg.channel.send(this.customHelp(args[0]))
  }
  
  
  customHelp(commandName:string){
    const command :commandTemplate = commands.get(commandName) 
    ||commands.find((cmnd:commandTemplate) => 
      (cmnd.aliases && cmnd.aliases.includes(commandName)));
      // ||(cmnd.clones
      //   &&(cmnd.clones[commandName]
      //     ||Object.values(cmnd.clones)
      //       .find((cmd:commandTemplate)=>
      //         cmd.aliases
      //         &&cmd.aliases.includes(commandName)))));
    if(!command)return {content:global.config.emojis.sad+'There is no such command as `'+commandName+'`'}
    
    let embed:EmbedObject={
      color : '#00bfff',
      title : '🥷| Command : '+command.name,
      description : '‣ **Description** : '+command.description,
      fields : []
    }
    if(command.aliases)embed.description+= `\n‣ **Aliases** : ${command.aliases.join(', ')}`;
    if(command.args)embed.description+='\n‣ **Arguments required** : true';
    if(command.usage)embed.description+='\n‣ **Usage** : '+command.usage;
    if(command.permissions)embed.description+='\n‣ **Permission Required** : '+command.permissions.join(', ');
    if(command.devOnly)embed.description+='\n‣ **Bot Devlopers Only** : true';
    if(command.examples)embed.fields?.push({
      name:'**Examples** :',
      value : '>>> *'+(!command.args?global.config.prefix+command.name+'\n':'')+global.config.prefix+command.name+' '+command.examples.join('\n'+global.config.prefix+command.name+' ')+(command.aliases?('\n'+command.aliases?.map((c:string)=>command.examples.map(e=>global.config.prefix+c+' '+e).join('\n')).join('\n')):'')+'*',
      inline :false
    });
    return {embed};
  }
}

export default {
  name : 'help',
  description : 'List of all Commands!',
  aliases : ['commands','list'],
  usage : '[optional : command-name]',
  // args : boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  examples : ['emoji','fetch'],
  run
}
