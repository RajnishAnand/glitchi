module.exports = {
  name : 'repeat',
  aliases : ['re'],
  description : 'Repeat',
  usage : '[text]',
  args : true,
  execute({msg,content, prefix}){
    msg.channel.send(content);
  }
}