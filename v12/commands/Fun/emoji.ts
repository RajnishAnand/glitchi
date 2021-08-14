import { argumentObjectType, message } from '../types';
import {Client, MessageReaction,User,Emoji} from 'discord.js';
// import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  
  main(args:string[]){
    this.msg.react(global.config.emojis.quick);
    try{
      if(args[0]){
        let regEx =new RegExp((args[0][0]=='"')?('\^'+args[0].replace(/^"|"$/g,'').substr(0,20)):(args[0].substr(0,20)),'i');
        let e=this.msg.client.emojis.cache.find((e:Emoji)=>regEx.test(e.name))
        if(e){
          if(args[1]=='-id')
            this.msg.channel.send(`\`id : ${e.id}\``);
          this.msg.channel.send(this.emojify({
            id:e.id,name:e.name,a:e.animated
          }));
        }
        else this.msg.reply('your specified emoji wasn\'t found!');
      }
      else{
       this.msg.channel.send(this.emojify(this.getRandomEmo() ))
        .then( (m: message)=>{
           m.react('🔄').then(()=>m.react('⛔'));
           return m;
        })
        .then((m:message)=>{
          m.awaitReactions((react,user)=>{
            if(user.id==this.msg.author.id){
              if('🔄'==react.emoji.name){
                m.edit(this.emojify(this.getRandomEmo()))
              }
              else if('⛔'== react.emoji.name){
                m.delete();
                return true;
              }
              try {react.users.remove(this.msg.author.id);} 
              catch (err) {};
            }; return false;
          },{time:120000,errors:['time']});
          
          setTimeout(()=>{
            try{m.reactions.removeAll()}
            catch(err){};
          },120000);
       });
      }
    }
    catch(err){
      this.msg.reply(err.message);
    };
  }
  
  getRandomEmo(){
    let emos = this.msg.client.emojis.cache.map((e:{id:string,name:string, animated:boolean})=>{return{
      id:e.id,
      name:e.name,
      a:e.animated
    }});
    return emos[Math.floor(Math.random()*emos.length)];
  }
  
  emojify(obj:emote){
    return `<${(obj.a)?'a':''}:${obj.name}:${obj.id}>`
  }

}

export default{
  name:'emoji',
  description: 'sends emoji for you!',
  aliases:['emote','emo','e'],
  usage: '[optional : emoji-name] [optional : -id]',
  // args : boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}

  // execute({msg,args}:any){
  //   this.msg.react(global.config.emojis.quick);
  //   let emotes:any[]=[];
  //   try{
  //     if(args.length){msg.client.guilds.cache.forEach((g:any)=>
  //       g.emojis.cache.forEach((e:emoji)=>{
  //       if(e.name?.toLowerCase()==args[0].toLowerCase())
  //         emotes.push({
  //           id:e.id,
  //           name:e.name,
  //           a:e.animated
  //         });
  //       })
  //     )}
  //     else{
  //     return msg.channel
  //       .send(this.emojify(
  //           this.getRandomEmo(msg.client)))
  //       .then((m:any)=>{
  //         m.react('859251872996655115')
  //           .then(m.react('859251838736924712'));
  //         return m;
  //       })
  //       .then((m:any)=>{
  //         m.awaitReactions((react:any,user:any)=>{
  //           if(user.id==msg.author.id){
  //             if('859251872996655115'==react.emoji.id){
  //               m.edit(this.emojify(
  //                 this.getRandomEmo(msg.client)))
  //             }
  //             else if('859251838736924712'== react.emoji.id)return m.delete();
  //             try {react.users.remove(msg.author.id);} 
  //             catch (err) {};
  //           }; return false;
  //         },{
  //           max:999,
  //           time : 120000,
  //           erros : ['time']
  //         });
  //         setTimeout(()=>{
  //           try{m.reactions.removeAll()}
  //           catch(err){};
  //         },120000);
  //     });
  //     }
  //     if (emotes.length){
  //       if(args[1]=='-id'){
  //         msg.channel
  //           .send(`\`id : ${emotes[0].id}\``);
  //       }
  //       msg.channel
  //         .send(this.emojify(emotes[0]));
  //     }
  //     else msg.reply('your specified emoji wasn\'t found!');
  //   }
  //   catch(err){
  //     msg.reply(err.message);
  //   }
  // }

interface emote{
  id:string,
  name:string,
  a:boolean
}