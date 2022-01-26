import {User} from 'discord.js';
import {Command} from 'Interfaces';

export const command : Command = {
  name: 'avatar',
  aliases: ['pfp', 'a'],
  description: 'User Avatar',
  usage: '<@user||userID>',
  args: false,

  async run({msg,args}){
    let user : User|undefined;
    if(!args.length)user = msg.author;
    else{
      args[0]=args[0].replace(/^<@!?/, '').replace(/>$/, '');
      
      // is valid user
      if(!/^\d*$/.test(args[0]))msg.reply(`Are you sure its a valid user ID. ${msg.client.config.emojis.knife}`);
      else {
        await msg.client.users.fetch(args[0])
          .then(u=>{user = u})
          .catch(()=>{
            msg.reply(`User with id \`${args[0]}\` not Found! ${msg.client.config.emojis.go}`).catch(()=>{})
          });
      }
    }

    // send embed 
    if(user){
      msg.reply({
        embeds : [{
          'color': `#00bfff`,
          'title': user.tag,
          'image': {
            url: `${user.displayAvatarURL({
              format : 'png',
              dynamic : true,
            })}?size=4096`,
          },
          'timestamp': new Date(),
        }]
      }).catch(()=>{})
    }
    
    
  }
}




