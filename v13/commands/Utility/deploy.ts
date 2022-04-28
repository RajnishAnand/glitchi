import {ApplicationCommandDataResolvable} from 'discord.js';
import {Command} from 'Interfaces';

export const command : Command = {
  name : 'deploy',
  description: 'deploy slash commands',
  usage : '?<add|rm|update|set|list> ?<commandName>|<...commanName>',
  userPerms: ['ADMINISTRATOR'],
  aliases:["register"],
  args:true,
  examples: ["add ping","update","list"],
  
  async run({msg,args}){
    if(!msg.guild)return;
    args = args.map(a=>a.toLowerCase());
    const subCommand = args.shift();

    if(subCommand=="list")list();
    else if(subCommand == "add")add();
    else if(subCommand == "rm"||subCommand=="remove")remove();
    else if(subCommand == "update")update();
    else if(subCommand == "set")set();
    else return msg.reply(`Use \`${msg.client.config.prefix}help deploy\` to get help.`)


    //List commands
    function list(){
      return msg.reply({
          embeds: [{
            color : 0x000000,
            author: {
              name: msg.guild!.me?.user.tag,
              iconURL: msg.guild!.me?.displayAvatarURL()
            },
            title : 'Avaliable Slash Commands : ',
            description : msg.client.slashCommands.map(c=>{
              return `${c.name} : ${c.description}`
            }).join('\n'),
            timestamp: new Date()
          }]
        })
    };
    

    // add command
    function add(){
      if(!args[0])return msg.reply("Please also provide name of a slashCommands to add.");

      const command:ApplicationCommandDataResolvable|undefined=
      msg.client.slashCommands.get(args[0]);
      
      if(!command)return msg.reply({
        content: `Requested command not found. Please check avaliable commands using \`${msg.client.config.prefix}deploy list\``,
        allowedMentions: {repliedUser:false}
      })
      msg.guild!.commands.create(command)
        .then(()=>{
          msg.channel.send(`${msg.client.config.emojis.salute} Successfully added /${command.name} command.`)
        })
        .catch(e=>{
          console.log(e);
          msg.reply(`Failed to add /${command.name} command`)
        });
    }


    // remove commands
    async function remove(){
      if(!args[0])return msg.reply("Please also provide name of registered slash command to remove!");

      const command = await msg.guild!.commands
        .fetch({cache:false})
        .then(l=>l.find(c=>c.name == args[0]));
      
      if(!command)return msg.reply({
        content: `Requested command isn't registered in your guild.`,
        allowedMentions: {repliedUser:false}
      })

      msg.guild!.commands.delete(command)
        .then(()=>{
          msg.channel.send(`${msg.client.config.emojis.salute} Successfully removed /${command.name} command.`)
        })
        .catch(e=>{
          console.log(e);
          msg.reply(`Failed to remove /${command.name} command`)
        });
    }


    // update commands
    async function update(){
      const commands = await msg.guild!.commands.fetch({cache:false});
      if(!commands)return msg.reply({
        content: "There aren't any slashCommands registered in your guild!",
        allowedMentions: {repliedUser:false}
      })

      try{
        commands.forEach(async c=>{
          const cmd = msg.client.slashCommands.get(c.name);
          if(cmd)await msg.guild!.commands.edit(c,cmd);
          else await msg.guild!.commands.delete(c)
        })
        msg.channel.send(msg.client.config.emojis.salute+"Successfully updated all registered commands.")
      }
      catch(e){
        msg.reply("Failed to update slash commands!");
      }
    }
    
    // set commands
    function set(){
      if(!args.length)return msg.reply("Please also provide names slash command to register!");

      const commands:ApplicationCommandDataResolvable[]= 
      msg.client.slashCommands.filter(c=> 
        args.includes(c.name)||args[0]=="all"
      ).map(c=>c);

      if(!commands.length)return msg.reply({
        content: "Please pick commands names avaliable from the list. Type `"+msg.client.config.prefix+"deploy list` to get a lust of avaliable slash commands.",
        allowedMentions:{repliedUser:false}
      })
      
      msg.guild!.commands.set(commands)
        .then(()=>msg.channel.send(`Commands: ${commands.map(c=>c.name)}\n${msg.client.config.emojis.salute}Successfully registered.`))
        .catch(()=>{
          msg.reply("Failed to register requested slash commands.")
        });
    }

  }
}
