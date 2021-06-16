module.exports = {
  name : 'repeat',
  description : 'Repeat',
  usage : '[text]',
  args : true,
  execute({msg,content}){
    msg.channel.send(content);
  }
}