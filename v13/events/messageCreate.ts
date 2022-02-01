import { GuildMember } from 'discord.js';
import { Event, ExtendMessage } from '../Interfaces';

export const event : Event = {
  name : 'messageCreate',
  async execute (client , msg :ExtendMessage ){ 
    if(msg.author.bot ||msg.channel.type=='DM'||!msg.guild)return;
    if(process.env.BETA){
      let betaTester= await msg
        .client.guilds.fetch(client.config.guildId)
        .then(async g=>g.members.fetch(msg.author.id))
        .then(m=>m.roles.cache.has("903716928391094332"))
        .catch(()=>false);
      if(!betaTester)return;
    }
    if(msg.channel.id in client.config.block && client.config.block[msg.channel.id]==msg.author.id)return;
    if (msg.content.startsWith(`<@${msg.client.user?.id}>`)){
      msg.reply(`Hi there ${msg.author.username}. My prefix is \`${client.config.prefix}\` , Type \`${client.config.prefix}help\` for help. `);
      return;
    }
    
    else if(!msg.content.toLowerCase().startsWith(client.config.prefix) ||
      !msg.content
    ) return;
    
    
    const args= msg.content
      .slice(client.config.prefix.length)
      .trim().split(/ +|\n/);
    let commandName = (args.shift() as string).toLowerCase();
    const command = client.commands.get(commandName)
    || client.aliases.get(commandName);
      
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
          msg.channel.send('Sometime i get bored alone '+client.config.emojis.sad+' and my system goes idle! but right now I\'m absolutely fine.\\🐥');
          break;
        case 'ok':
        case '0k':
          msg.channel.send(client.config.emojis.ok); 
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
    if(command.userPerms && (msg.author.id!=client.config.ownerId)){
      const authorPerms = msg.channel.permissionsFor(msg.author);
      if (!authorPerms ||!command.userPerms.every((c)=>authorPerms.has(c))) {
        return msg.reply(` Permission(s) required to run this command :\n  └⊳ \` ${command.userPerms.join('\`\n  └⊳ \`')} \``);
      }
    }
     
    try {
      if ((command.devOnly || false) == true &&
        (msg.author.id != client.config.ownerId) == true) {
        return;
      }
      else if (command.args && !args.length) {
        msg.reply(`Command : \` ${command.name} \` requires argument! ${client.config.emojis.sneak}.\nType \`${client.config.prefix}help ${command.name}\` to get help on it.`);
      }
      else {
        const content =()=> msg.content
          .substring(client.config.prefix.length)
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


