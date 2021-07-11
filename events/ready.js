const {prefix} = require('../config.json');
module.exports = {
  name : 'ready',
  once : true,
  execute(client){
    const test = process.env.SHELL||false ;
    console.log('ready! Logged in as :',client.user.tag);
    if(!test)
      client.user.setActivity(`${prefix}commands in ${client.guilds.cache.size} servers`, { type: "LISTENING"}); 
  }
}