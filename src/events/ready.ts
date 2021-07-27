import conf from '../config.js';
module.exports = {
  name : 'ready',
  once : true,
  execute(client:any){
    const test = process.env.SHELL||false ;
    console.log('Logged in as :',client.user.tag);
    if(!test)
      client.user.setActivity(`${conf.prefix}commands in ${client.guilds.cache.size} servers`, { type: "LISTENING"});
    else client.user.setStatus('invisible');
  }
}