module.exports = {
  name : 'repeat',
  description : 'Repeat',
  args : true,
  execute(msg,arg){
    msg.channel.send(msg.content.replace('|repeat ',''));
  }
}