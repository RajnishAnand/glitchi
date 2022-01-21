import pageView from '#libs/pagination';
import {MessageEmbed} from 'discord.js';
import {APIEmbed} from 'discord.js/node_modules/discord-api-types';
import {Command, CommandArgument} from 'Interfaces';

export const command : Command={
  name : 'help',
  description : 'List of all Commands!',
  aliases : ['commands','list'],
  usage : '?<command_name>',
  examples : ['emoji','fetch'],
  run
}

async function run({msg,args}:CommandArgument){
  if(!args.length){
    let cmnds = msg.client.commands.filter(cmd=>!cmd.devOnly);
    let data:{[key:string]:string}= {};
    cmnds.forEach((cmd)=>{
      if(cmd.category==undefined)return;
      if(!(cmd.category in data))data[cmd.category]='';
      data[cmd.category]+=`‣ ${msg.client.config.prefix}${cmd.name} ⇨ ${cmd.description}\n`
    })
      
    new pageView(msg,Object.keys(data).map((m:string)=>{
      return new MessageEmbed({
        title:m,
        description:data[m],
        color:'#00bfff'
      })
    }));
  }
  else {
    const command: Command|undefined = msg.client.commands.get(args[0])|| msg.client.aliases.get(args[0]);

    if(!command) return msg.reply({
      content: msg.client.config.emojis.sad+'There is no such command as `'+args[0]+'`'
    });
    
    let embed :APIEmbed= {
      color : 0x00bfff,
      title : '🥷| Command : '+command.name,
      description : '‣ **Description** : '+command.description,
      fields : []
    }

    if(command.aliases)embed.description+= `\n‣ **Aliases** : ${command.aliases.join(', ')}`;
    if(command.args)embed.description+='\n‣ **Arguments required** : true';
    if(command.usage)embed.description+='\n‣ **Usage** : `'+command.usage+'`';
    if(command.userPerms)embed.description+='\n‣ **Permission Required** : '+command.userPerms.join(', ');
    if(command.devOnly)embed.description+='\n‣ **Bot Devlopers Only** : true';
    if(command.examples)embed.fields?.push({
      name:'**Examples** :',
      value : '>>> *'+(!command.args?msg.client.config.prefix+command.name+'\n':'')+msg.client.config.prefix+command.name+' '+command.examples.join('\n'+msg.client.config.prefix+command.name+' ')+(command.aliases?('\n'+command.aliases?.map((c:string)=>command.examples?.map(e=>msg.client.config.prefix+c+' '+e).join('\n')).join('\n')):'')+'*',
      inline :false
    });
    msg.reply({embeds:[new MessageEmbed(embed)]})
  };
}

