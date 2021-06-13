const ownerId = require('../../config.json').ownerId;
module.exports = {
  name : 'eval',
  description : 'Evaluate',
  devOnly : true,
  args : true,
  execute(msg,args,client){
    try{
      if(msg.author.id==ownerId){
        msg.channel.send(`\`\`\`\n${eval(args.join(' '))}\`\`\``.substr(0,3500));
      }
      else{
        msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
      }
    }
    catch (err){
      msg.channel.send(`\`\`\`\n${err.message}\`\`\``);
    }
  }
}