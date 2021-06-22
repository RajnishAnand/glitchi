module.exports = {
  name:'msg',
  description : 'message to channel',
  alisaes:['message'],
  args : true,
  devOnly : true,
  execute({msg,args,content,client}){
    args[0]=args[0]
      .replace(/^<#/,'')
      .replace(/>$/,'');
     
    try{
      client.channels.cache.get(args[0]).send(content);
      msg.channel.send(`your was message successfully sent to ${client.channels.cache.get(args[0])}!`); 
    }
    catch (err){
      //console.log(args,parseInt(args[0]));
      msg.channel.send(err.message);
      //console.log(args[0],client.channels.cache)
    };
  }
}