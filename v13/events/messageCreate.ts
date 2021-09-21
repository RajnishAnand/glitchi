import { Message, GuildMember, Util } from 'discord.js';
import { commands } from '../libs/command-handler';
import { commandTemplate} from '../commands/types';

export default {
  name : 'messageCreate',
  execute (msg: Message){
    if(msg.author.bot ||msg.channel.type=='DM'||!msg.guild)return;
    if(msg.channel.id in global.config.block && global.config.block[msg.channel.id]==msg.author.id)return;
    if (msg.content.startsWith(`<@${msg.client.user?.id}>`)){
      msg.channel.send(`Hi there ${msg.author.username}. My prefix is \`${global.config.prefix}\` , Type \`${global.config.prefix}help\` for help. `);
      return;
    }
    
    else if(!msg.content.toLowerCase().startsWith(global.config.prefix) ||
      !msg.content
    ) return;
    
    
    const args = msg.content
      .slice(global.config.prefix.length)
      .trim().split(/ +/);
    let commandName = args.shift()?.toLowerCase() as string;
    const command = (commands.get(commandName) 
    ||commands.find((cmnd:any) => 
      (cmnd.aliases && cmnd.aliases.includes(commandName))) ) as commandTemplate;
    
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
          msg.channel.send(global.config.emojis.ok); 
      };
      return;
    };
    
    if (command.permissions) {
      const authorPerms = msg.channel.permissionsFor(msg.author);
      const myPerms= msg.channel.permissionsFor(msg.guild.me as GuildMember);
      if (!authorPerms ||!command.permissions.every((c)=>authorPerms.has(c))) {
        return msg.reply(` Permission(s) required to run this command :\n  └⊳ \` ${command.permissions.join('\`\n  └⊳ \`')} \``);
      }
      else if (!myPerms ||!command.permissions.every((c)=>myPerms.has(c))) {
        return msg.reply(`Permission(s) i require to run this command:\n  └⊳ \` ${command.permissions.join('\`\n  └⊳ \`')} \``);
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
        const content =()=> msg.content
          .substr(global.config.prefix.length)
          .replace(/^[\s+]?/, "")
          .replace(commandName + ' ', '');
        // const cleanContent = msg.cleanContent
          // .substr(global.config.prefix.length)
          // .replace(/^[\s+]?/, "")
          // .replace(commandName + ' ', '');
        command.run({
          msg,
          args,
          content,
          commandName,
          // error:this.err
        });
      }
    } 
    catch (error :any) {
      msg.reply(error.message);
      // this.err(msg,error);
    
    }
  }
}


