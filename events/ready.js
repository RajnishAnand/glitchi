const {prefix} = require('../config.json');
module.exports = {
  name : 'ready',
  once : true,
  execute(client){
    console.log('ready!');
    if(process.env.PORT||false)
      client.user.setActivity(`${prefix}commands`, { type: "LISTENING"}); 
  }
}