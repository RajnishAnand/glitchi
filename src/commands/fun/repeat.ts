module.exports = {
  name : 'repeat',
  aliases : ['re'],
  description : 'Repeat',
  usage : '[text]',
  args : true,
  execute({msg,content}:any){
    msg.channel.send(content);
  }
}