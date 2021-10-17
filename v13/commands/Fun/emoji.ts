import { argumentObjectType } from '../types';
  
function run({msg,args}:argumentObjectType){
  if(args.length){
    let e = msg.client.emojis.cache.find(f=> 
      new RegExp(`^${args[0]}$`,'i').test(f.name||''));
    if(!e) e = msg.client.emojis.cache.find(f=>
      new RegExp(`^${args[0]}`,'i').test(f.name||''));
    if(!e) e = msg.client.emojis.cache.find(f=>
      new RegExp(args[0],'i').test(f.name||''));
    if(!e) return msg.reply('Your specified emoji not found!');
    msg.reply(e.toString());
  }
  else{
    let emojis = msg.client.emojis.cache.map(e=>e.toString());
    msg.reply(emojis[Math.ceil(Math.random()*emojis.length)])
      .then( (m)=>{
        m.react('🔄').then(()=>m.react('⛔'));
        return m;
      })
      .then((m)=>{
        m.awaitReactions({
          filter: (react,user)=>{
            if(user.id==msg.author.id){
              if('🔄'==react.emoji.name){
                m.edit(emojis[Math.ceil(Math.random()*emojis.length)])
              }
              else if('⛔'== react.emoji.name){
                m.delete();
                return true;
              }
              try {react.users.remove(msg.author.id);}
              catch (err) {};
            }; return false;
          },
          time:120000
        });
        
        setTimeout(()=>{
          try{m.reactions.removeAll()}
          catch(err){};
        },120000);
     });
  }
}


export default{
  name:'emoji',
  alias: ['e','emo'],
  description: 'sends emoji for you!',
  run
}




// import pageView from '../../libs/pagination/index';

// run (args:string[]){
//     this.msg.react(global.config.emojis.quick);
//     try{
//       if(args[0]){
//         let regEx =new RegExp((args[0][0]=='"')?('\^'+args[0].replace(/^"|"$/g,'').substr(0,20))+'\$':(args[0].substr(0,20)),'i');
//         let e=this.msg.client.emojis.cache.find((e:Emoji)=> new RegExp('\^'+args[0].substr(0,20)).test(e.name));
//         if(!e)e=this.msg.client.emojis.cache.find((e:Emoji)=>regEx.test(e.name))
//         if(e){
//           if(args[1]=='-id')
//             this.msg.channel.send(`\`id : ${e.id}\``);
//           this.msg.channel.send(this.emojify({
//             id:e.id,name:e.name,a:e.animated
//           }));
//         }
//         else this.msg.reply('your specified emoji wasn\'t found!');
//       }
//       else{
//       this.msg.channel.send(this.emojify(this.getRandomEmo() ))
//         .then( (m: message)=>{
//           m.react('🔄').then(()=>m.react('⛔'));
//           return m;
//         })
//         .then((m:message)=>{
//           m.awaitReactions((react,user)=>{
//             if(user.id==this.msg.author.id){
//               if('🔄'==react.emoji.name){
//                 m.edit(this.emojify(this.getRandomEmo()))
//               }
//               else if('⛔'== react.emoji.name){
//                 m.delete();
//                 return true;
//               }
//               try {react.users.remove(this.msg.author.id);} 
//               catch (err) {};
//             }; return false;
//           },{time:120000,errors:['time']});
          
//           setTimeout(()=>{
//             try{m.reactions.removeAll()}
//             catch(err){};
//           },120000);
//       });
//       }
//     }
//     catch(err){
//       this.msg.reply(err.message);
//     };
//   }
  
  // getRandomEmo(){
  //   let emos = this.msg.client.emojis.cache.map((e:{id:string,name:string, animated:boolean})=>{return{
  //     id:e.id,
  //     name:e.name,
  //     a:e.animated
  //   }});
  //   return emos[Math.floor(Math.random()*emos.length)];
  // }
  
  // emojify(obj:emote){
  //   return `<${(obj.a)?'a':''}:${obj.name}:${obj.id}>`
  // }


// interface emote{
//   id:string,
//   name:string,
//   a:boolean
// }