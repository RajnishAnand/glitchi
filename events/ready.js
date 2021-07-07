const {prefix} = require('../config.json');
module.exports = {
  name : 'ready',
  once : true,
  execute(client){
    console.log('ready!');
    if(process.env.PORT||false)
      console.log('ready! port :',port);
      client.user.setActivity(`${prefix}commands in ${client.guilds.cache.size} servers`, { type: "LISTENING"}); 
  }
}