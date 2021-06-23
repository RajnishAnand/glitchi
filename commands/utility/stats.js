const prettyMs=require('pretty-ms');
const os = require('os');
module.exports = {
  name:'stats',
  description : 'statistics of bot',
  aliases: ['statistics','sts'],
  execute({msg,args}){
    let stats = new Array;
    let uptime = new Array;
    let sysInfo = new Array;
    
    try{
      stats.push(`**Node.js** : v${process.versions.node}`);
      stats.push(`**Discord.js** : v${require("../../package.json").dependencies["discord.js"].substr(1)}`);
      stats.push(`**Servers** : ${msg.client.guilds.cache.size}`);
      stats.push(`**Channels** : ${msg.client.channels.cache.size}`);
      stats.push(`**Users** : ${msg.client.users.cache.size}`)
      
      uptime.push(`**Client** : ${prettyMs(msg.client.uptime)}`);
      uptime.push(`**Host** : ${prettyMs(os.uptime())}`);
      uptime.push(`**Total** : ${prettyMs(os.uptime())}`);
      
      let data= process.memoryUsage();
      sysInfo.push(`**Memory** : ${this.formatMemory(data.rss)}MB | ${this.formatMemory(os.totalmem())}MB`);
      sysInfo.push(`**Total Heap** : ${this.formatMemory(data.heapTotal)}MB`);
      
      let cpu = require("os").cpus()[0].times;
      sysInfo.push(`**CPU Load** : ${(((cpu.user + cpu.nice + cpu.sys) / cpu.idle) * 100).toFixed(2)}%`);
      
    }
    catch(err){
      console.log(err);
      msg.channel.send('There was a error while getting statistics.');
    }
    finally{
      msg.channel.send({
        embed:{
          color :'#00bfff',
          author:require('../../config.json').info,
          fields : [
            {
              name:'Statistics',
              value:'• '+stats.join('\n• ')
            },
            {
              name:'Uptime',
              value :'• '+uptime.join('\n• ')
            },
            {
              name:'Server usage',
              value:'• '+sysInfo.join('\n• ')
            }
          ],
          timestamp : new Date(),
          footer :{
            text: 'Requested by '+msg.author.username,
            icon_url:msg.author.avatarURL({format:'png'})
          }
        }
      }).catch(err=>msg.reply('Found error while executing this command please send this to devloper. Code : ERRSTATS61'));
    };
  },
  formatMemory(size){
    return Math.round(size/1024/1024*100)/100;
  }
}
