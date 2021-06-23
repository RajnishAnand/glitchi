module.exports = {
  name : 'repeat',
  description : 'Repeat',
  usage : '[text]',
  args : true,
  execute({msg,commandName, prefix}){
    let content = msg.cleanContent.replace(prefix+commandName+' ','');
    msg.channel.send(content);
  }
}