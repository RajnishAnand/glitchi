import {message, commandTemplate} from '../commands/types';
import {commands} from '../libs/handler.js';
import {Message, TextChannel} from 'discord.js';

module.exports = {
  name: 'message',
  execute(msg : Message) {
    if(msg.author.bot ||msg.channel.type=='dm')return;
    if(msg.channel.id in global.config.block && global.config.block[msg.channel.id]==msg.author.id)return;
    if (msg.content.startsWith(`<@${msg.client.user?.id}>`)){
      msg.channel.send(`Hi there ${msg.author.username}. My prefix is \`${global.config.prefix}\` , Type \`${global.config.prefix}help\` for help. `);
      return;
    }
    else if(!msg.content.toLowerCase().startsWith(global.config.prefix) ||
      !msg.content
    ) return;
    
    
    const args = msg
      .content
      .slice(global.config.prefix.length)
      .trim()
      .split(/ +/);
    let commandName = args.shift()?.toLowerCase() as string;
    const command: commandTemplate = commands.get(commandName) 
    ||commands.find((cmnd:commandTemplate) => 
      (cmnd.aliases && cmnd.aliases.includes(commandName))
      ||(cmnd.clones
        &&(cmnd.clones[commandName]
          ||Object.values(cmnd.clones)
            .find((cmd:commandTemplate)=>
              cmd.aliases
              &&cmd.aliases.includes(commandName)))));
      
      
    
    if (!command) {
      switch (commandName) {
        case 'beep':
          msg.channel.send('boop!');
          break;
        
        case 'hi':
        case 'hello':
          msg.reply(['Hi', 'Hello there!', 'Hello'][Math.floor(Math.random() * 3)]);
          break;

        case 'hru':
        case 'how are you':
          msg.channel.send('Sometime i get bored alone '+global.config.emojis.sad+' and my system goes idle! but right now I\'m absolutely fine.\\🐥');
          break;
        case 'ok':
        case '0k':
          msg.channel.send('0k');
        
      };
      return;
    };
    
    if (command.permissions) {
      const authorPerms = msg.channel
        .permissionsFor(msg.author);
      if (!authorPerms ||
        !authorPerms.has(command.permissions)) {
        return msg.reply(`🥲 You require PERMISSION : **\` ${command.permissions} \`** to run \` ${commandName} \` command!`);
      }
    }
    
    try {
      if ((command.devOnly || false) == true &&
        (msg.author.id != global.config.ownerId) == true) {
        return;
      }
      else if (command.args && !args.length) {
        msg.channel.send(`Command : \` ${command.name} \` requires argument! ${global.config.emojis.sneak} ${msg.author}. Type \`${global.config.prefix}help ${command.name}\` to get help on it.`);
      }
      else {
        // command.require
        const content = msg.content
          .substr(global.config.prefix.length)
          .replace(/^[\s+]?/, "")
          .replace(commandName + ' ', '');
        new command.run({msg,args,content,commandName,error:this.err});
      }
    } catch (error) {
      msg.reply(error.message);
      this.err(msg,error);
    }
  },
  
  err(msg: message,err:{message:string}) {
    try{
    (msg.client.channels.cache.get(global.config.channels.errorLog) as TextChannel).send(`>>> \` User : ${msg.author.tag
        } \n Guild : ${msg.guild.name
        } \n Channel : \`<#${msg.channel.id
        }>\n\` error : ${err.message
        } \n Command :\` \`${msg.cleanContent}\``);
  }catch(err){
    console.warn('Caught Error while logging Error',err)}
  }
}
