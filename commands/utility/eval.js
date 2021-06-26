const util= require('util');
const config = require('../../config.json');
module.exports = {
  name : 'eval',
  aliases : ['ev'],
  description : 'Evaluate',
  devOnly : true,
  args : true,
  async execute({msg,content},client=msg.client){
    try{
      if(msg.author.id===config.ownerId){
        let evaledStr =this.debug(eval(content));
        await msg.channel.send(`\` ${Math.ceil(evaledStr.length/1924)}m|${evaledStr.length}ch \``);
        msg.channel.send(evaledStr, {
          code:'javascript',
          split : {maxlength:1924},
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