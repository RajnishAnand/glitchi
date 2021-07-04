module.exports={
  name:'emoji',
  description: 'sends emoji for you!',
  aliases:['emote','emo','e'],
  usage: '[optional : emoji-name] [optional : -id]',
  execute({msg,args}){
    msg.react('856818054602948608');
    let emotes=[];
    try{
      if(args.length){msg.client.guilds.cache.forEach(g=>
        g.emojis.cache.forEach(e=>{
        if(e.name.toLowerCase()==args[0].toLowerCase())
          emotes.push({
            id:e.id,
            name:e.name,
            a:e.animated
          });
        })
      )}
      else{
       return msg.channel
        .send(this.emojify(
            this.getRandomEmo(msg.client)))
        .then(m=>{
          m.react('859251872996655115')
            .then(m.react('859251838736924712'));
          return m;
        })
        .then(m=>{
          m.awaitReactions((react,user)=>{
            if(user.id==msg.author.id){
              if('859251872996655115'==react.emoji.id){
                m.edit(this.emojify(
                  this.getRandomEmo(msg.client)))
              }
              else if('859251838736924712'== react.emoji.id)return m.delete();
              try {react.users.remove(msg.author.id);} 
              catch (err) {};
            }; return false;
          },{
            max:999,
            time : 180000,
            erros : ['time']
          });
          setTimeout(()=>{
            try{m.reactions.removeAll()}
            catch(err){};
          },180000);
       });
      }
      if (emotes.length){
        if(args[1]=='-id'){
          msg.channel
            .send(`\`id : ${emotes[0].id}\``);
        }
        msg.channel
          .send(this.emojify(emotes[0]));
      }
      else msg.reply('your specified emoji wasn\'t found!');
    }
    catch(err){
      msg.reply(err.message);
    }
  },
  emojify(obj){
    return `<${(obj.a)?'a':''}:${obj.name}:${obj.id}>`
  },
  getRandomEmo(client){
    let emos = client.emojis.cache.map(e=>{return{
      id:e.id,
      name:e.name,
      a:e.animated
    }});
    return emos[Math.floor(Math.random()*emos.length)];
  }
}