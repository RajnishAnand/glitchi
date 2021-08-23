module.exports = {
  name : 'ready',
  once : true,
  execute(client:any){
    console.log('Logged in as :',client.user.tag);
    if(!global.config.local)
      client.user.setActivity(`${global.config.prefix}commands in ${client.guilds.cache.size} servers`, { type: "LISTENING"});
    else client.user.setStatus('invisible');
    delete process.env.TOKEN;
    delete process.env.PORT;
  }
}