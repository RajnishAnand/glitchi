module.exports = {
  name : 'repeat',
  args : true,
  execute(msg,arg){
    msg.channel.send(msg.content.replace('|repeat ',''));
  }
}