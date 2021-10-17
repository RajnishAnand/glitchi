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
  aliases: ['e','emo'],
  description: 'sends emoji for you!',
  run
}