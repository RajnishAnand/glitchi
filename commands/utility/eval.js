module.exports = {
  name : 'eval',
  description : 'Evaluate',
  botOwner : true,
  args : true,
  execute(msg,args){
    try{
      msg.channel.send(`\`\`\`\n${eval(args.join(' '))}\`\`\``);
    }
    catch (err){
      msg.channel.send(`\`\`\`\n${err.message}\`\`\``);
    }
  }
}