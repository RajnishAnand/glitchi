import {select} from '../../libs';
import {ApplicationCommandDataResolvable} from 'discord.js';
import {Command} from 'Interfaces';

export const command : Command = {
  name : 'deploy',
  description: 'deploy slash commands',
  usage : '?<...commandName>',
  userPerms: ['ADMINISTRATOR'],
  
  async run({msg,args}){
    if(!msg.guild)return;
    if(!args.length){
      return msg.reply({
        embeds: [{
          color : 0x000000,
          title : 'Avaliable Slash Commands : ',
          description : msg.client.slashCommands.map(c=>{
            return `${c.name} : ${c.description}`
          }).join('\n'),
          timestamp: new Date()
        }]
      })
    }
    else{
      args= args.map(e=>e.toLowerCase());
      const commands:ApplicationCommandDataResolvable[] =[];
      msg.client.slashCommands.forEach(c=>{
        if(args.includes(c.name)){
          commands.push(c)
        }
      })
      const confirm = await select(msg,{
        title : "Select Confirm to Confirm",
        content : `Commands to deploy : \`${commands.map(e=>e.name).join(', ')||'NONE'}\``,
        options : [
          {
            label : 'Confirm',
            description : 'Select to Confirm',
            value: '1'
          },
          {
            label: 'Cancel',
            description: 'cancel deployment',
            value: '0'
          }
        ]
      }).catch(()=>{})

      if(confirm && confirm == '1'){
        msg.client.registerSlashCommand({
          guildId : msg.guild.id,
          commands 
        }).then(b=>{
          if(b)msg.channel.send(msg.client.config.emojis.salute+' Successfully registered SlashCommand(s).');
          else msg.channel.send('Failed to deploy SlashCommands.');
        })
      }
      else {
        msg.reply({
          content : 'deployment Cancelled.',
          failIfNotExists: false,
        })
      }
    }
  }
}
