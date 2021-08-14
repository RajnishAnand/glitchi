import { argumentObjectType, message } from '../types';
import pageView from '../../libs/pagination/index'
import { User } from 'discord.js';


class run{
  declare msg: message;
  declare error :(a:message,b:Error)=>null;
  constructor ({msg,args,error}: argumentObjectType){
    this.msg = msg;
    // this.error = error;
    this.main(args)
  }
  
  async main(args:string[]){
    this.msg.react(global.config.emojis.quick);
    let userIDs = new Array;
    
    if (args.length) {
      args.forEach((arg:string )=> {
        arg = arg.replace(/^<@!?/, '').replace(/>$/, '');
        if (Number(arg)!==NaN) userIDs.push(arg);
        else this.msg.channel.send(`can't resolve \`${arg}\` as a User!`);
      });
    }
    else userIDs.push(this.msg.author.id);
    
    userIDs = userIDs.slice(0, 5);
    this.fetchUsers(userIDs);
    // userIDs.forEach((id:string) => 
  }
  
  async fetchUsers (id:string[]){
    let userL = new Array();
    for (let i =0;i<id.length;i++){
      await this.msg.client.users
        .fetch(id[i])
        .then((user:User) =>{
          userL.push ({
            'color': `#00bfff`,
            'title': user.tag,
            'image': {
              url: `${user.displayAvatarURL({
                format : 'png',
                dynamic : true,
              })}?size=4096`,
            },
            'timestamp': new Date(),
          });
        })
        .catch((err) => {
          this.error(this.msg,err);
          this.msg.channel.send(`can't resolve \`${id}\` as a User!`)
        });
    }
    pageView(this.msg,userL);
  }
}

export default{
  name: 'avatar',
  aliases: ['pfp', 'a'],
  description: 'User Avatar',
  usage: '[optional : @user or userID]',
  args: false,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}