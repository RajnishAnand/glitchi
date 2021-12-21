import { Message, GuildMember, Util } from 'discord.js';
import { commands } from '../libs/command-handler';
import { commandTemplate} from '../commands/types';

export default {
  name : 'messageCreate',
  async execute (msg: Message){
    if(msg.author.bot ||msg.channel.type=='DM'||!msg.guild)return;
    if(global.config.beta){
      let betaTester= await msg
        .client.guilds.fetch("856090036998635520")
        .then(async g=>g.members.fetch(msg.author.id))
        .then(m=>m.roles.cache.has("903716928391094332"))
        .catch(()=>false);
      if(!betaTester)return;
    }
    if(msg.channel.id in global.config.block && global.config.block[msg.channel.id]==msg.author.id)return;
    if (msg.content.startsWith(`<@${msg.client.user?.id}>`)){
      msg.reply(`Hi there ${msg.author.username}. My prefix is \`${global.config.prefix}\` , Type \`${global.config.prefix}help\` for help. `);
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
      
    //TODO : MOVE these cases to saperate file
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
    
    // My permissions required
    if (command.requiredPerms) {
      const myPerms= msg.channel.permissionsFor(msg.guild.me as GuildMember);
      if (!myPerms ||!command.requiredPerms.every((c)=>myPerms.has(c))) {
        return msg.reply(`Permission(s) i require to run this command:\n  └⊳ \` ${command.requiredPerms.join('\`\n  └⊳ \`')} \``);
      }
    }
    
    //User perms required
    if(command.userPerms && (msg.author.id!=global.config.ownerId)){
      const authorPerms = msg.channel.permissionsFor(msg.author);
      if (!authorPerms ||!command.userPerms.every((c)=>authorPerms.has(c))) {
        return msg.reply(` Permission(s) required to run this command :\n  └⊳ \` ${command.userPerms.join('\`\n  └⊳ \`')} \``);
      }
    }
     
    try {
      if ((command.devOnly || false) == true &&
        (msg.author.id != global.config.ownerId) == true) {
        return;
      }
      else if (command.args && !args.length) {
        msg.reply(`Command : \` ${command.name} \` requires argument! ${global.config.emojis.sneak}.\nType \`${global.config.prefix}help ${command.name}\` to get help on it.`);
      }
      else {
        const content =()=> msg.content
          .substr(global.config.prefix.length)
          .replace(/^[\s+]?/, "")
          .replace(commandName + ' ', '');
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


