module.exports = {
  name:'msg',
  description : 'message to channel',
  alisaes:['message'],
  args : true,
  devOnly : true,
  execute({msg,args,content}:any){
    let channel = args[0]
      .replace(/^<#/,'')
      .replace(/>$/,'');
     
    try{
      msg.client.channels.cache.get(channel).send(content.replace(args[0],''));
      msg.channel.send(`your was message successfully sent to ${msg.client.channels.cache.get(channel)}!`); 
    }
    catch (err){
      //console.log(args,parseInt(args[0]));
      msg.channel.send(err.message);
      //console.log(args[0],msg.client.channels.cache)
    };
  }
}