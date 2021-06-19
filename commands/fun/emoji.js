module.exports={
  name:'emoji',
  description: 'sends emoji for you!',
  args: true,
  aliases:['emote','emo'],
  usage: '[emoji-name] [optional : -id]',
  execute({msg,args,client}){
    let emotes=[];
    try{
     client.guilds.cache.forEach(g=>
      g.emojis.cache.forEach(e=>{
        if(e.name.toLowerCase()==args[0].toLowerCase())
          emotes.push({
            id:e.id,
            name:e.name,
            a:e.animated
          });
      })
     )
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
  }
}