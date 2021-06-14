module.exports = {
  name : 'repeat',
  description : 'Repeat',
  args : true,
  execute(msg,arg, content){
    msg.channel.send(content);
  }
}