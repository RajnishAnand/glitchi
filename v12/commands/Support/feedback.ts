import { 
  argumentObjectType, 
  message,
  commandTemplate
} from '../types';
import {TextChannel} from 'discord.js';
// import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  declare suggest : boolean;
  constructor ({msg,args,commandName,error}: argumentObjectType){
    this.msg = msg;
    this.suggest = commandName=='suggest';
    // this.error = error;
    this.main(args)
  }
  main(args:string[]){
    const text = args.join(" ")
      //.replace(/\n+/,'\n');
      .replace(/\n{2,}/g, '\n');
      
    const embed = {
      title : `📮| ${(this.suggest)?'Suggestion':'Feedback'} : `,
      color : '#1ac95d',
      description : '>>> '+text,
      thumbnail:{
        url:this.msg.author.displayAvatarURL({
                format : 'png',
                dynamic : true,
                size: 4096,
        })
      },
      fields : [{
        name : '🥷| Userinfo : ',
        value : '```\n'+`Username : ${this.msg.author.tag
          }\nID : ${this.msg.author.id
          }\nGuild : ${this.msg.guild.name
          }`+'```',
      }],
      timestamp : new Date(),
    };
    //msg.delete();
    (this.msg.client.channels.cache.get(this.suggest?global.config.channels.suggestion:global.config.channels.feedback) as TextChannel).send({embed})
      .then((msg) => {
        if(this.suggest){
          msg.react(global.config.emojis.thumbsup);
          msg.react(global.config.emojis.thumbsdown);
        }
    }).catch((err:Error) => {
        this.msg.channel.send('There was an error while sending your Feedback! Please inform this to devloper!')
        // this.error(msg,err);
    }).then(()=>
      this.msg.channel.send(`Thank you for your ${this.suggest?'Suggestion':'Feedback'}! Your ${this.suggest?'Suggestion':'Feedback'} was successfully sent to support server.\😊`) 
    );
  }
}

export default{
  name: 'feedback',
  description: 'Send feedback',
  examples : ['testing feedback command'],
  aliases : ['fd'],
  usage: '[feedback]',
  args : true,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run,
}
