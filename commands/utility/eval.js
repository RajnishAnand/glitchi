const util= require('util');
const config = require('../../config.json');
module.exports = {
  name : 'eval',
  description : 'Evaluate',
  devOnly : true,
  args : true,
  execute({msg,content,client}){
    try{
      if(msg.author.id===config.ownerId){
        msg.channel.send(this.debug(eval(content)), {
          code:'javascript',
          split : true,
        }).catch(err=>{
          msg.channel.send(err.message,{code:true});
        })
      }
      else{
        msg.channel.send('You breached level 1 security, level 2 stands Guard! 🛡️');
      }
    }
    catch (err){
      msg.channel.send(err.message,{code:true});
    };
    
  },
  debug(evaled){
    try{
      //console.log(type);
      if(typeof(evaled)==='string'){
        evaled=evaled
          .replace(/</g,'<​')
          .replace(/`/g,'`​');
      }
      return util.inspect(evaled);
    }
    catch(err){
      return err.message;
    }
  }
}