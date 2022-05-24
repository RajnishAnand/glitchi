import {pageView} from '#libs';
import {MessageEmbedOptions} from 'discord.js';
import {MessageEmbed} from 'discord.js';
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
      data[cmd.category]+=`${cmd.roleAccess?"🔸":"🔹"} **${cmd.name} ⤍**  *${cmd.description}*\n`
    })

    Object.keys(data).forEach(c=>{
      data[c]+=`>>> Use \`${msg.client.config.prefix}help <CommandName>\` to get more help on it.`
    })
      
    new pageView(msg,Object.keys(data).map((m:string)=>{
      return new MessageEmbed({
        title:`Help >> Category: ${m}`,
        description:data[m],
        color:'#00bfff',
      })
    }));
  }
  else {
    const command: Command|undefined = msg.client.commands.get(args[0])|| msg.client.aliases.get(args[0]);

    if(!command) return msg.reply({
      content: msg.client.config.emojis.sad+'There is no such command as `'+args[0]+'`',
      allowedMentions: {repliedUser: false},
    });
    
    const embed: MessageEmbedOptions= {
      color : 0x00bfff,
      title : `${msg.client.config.emojis.yus}|Help >> Command: ${command.name}`,
      description : '🔹 **Description** : '+command.description,
      fields : []
    }

    // Aliases
    if(command.aliases)embed.description+= `\n🔹 **Aliases** : ${command.aliases.join(', ')}`;

    // Arguments
    if(command.args)embed.description+='\n🔹 **Arguments required** : `true`';

    // Usage
    if(command.usage)embed.description+='\n🔹 **Usage** : `'+command.usage+'`';

    // Permission
    if(command.userPerms)embed.description+='\n🔹 **Permission Required** : '+command.userPerms.join(', ');

    // RoleAccess
    if(command.roleAccess)embed.description+=`\n🔸 **RoleAccess** : \`${command.roleAccess}\``;

    // DevOnly
    if(command.devOnly)embed.description+='\n🔹 **Bot Devlopers Only** : `true`';

    // Exemples
    if(command.examples||!command.args){
      const cmdNames = [...command.aliases??"",command.name];
      embed.fields?.push({
        name:'**Examples** :',
        value : `>>> ${command.args?'':`\`${msg.client.config.prefix}${command.name}\`\n`}${command.examples?.length?command.examples.map((e)=>
          "`"+msg.client.config.prefix+cmdNames[~~(Math.random()*cmdNames.length)]+" "+e+"`"
        ).join("\n"):""}`
      });
    }

    msg.reply({
      embeds:[new MessageEmbed(embed)],
      allowedMentions:{repliedUser:false}
    })
  }
}

