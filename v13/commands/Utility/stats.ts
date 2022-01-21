import prettyMs from 'pretty-ms';
import os from 'os';
import {Command} from 'Interfaces';

export const command :Command= {
  name:'stats',
  description : 'statistics of bot',
  aliases: ['statistics','sts'],

  run({msg}){
    let stats = new Array;
    let uptime = new Array;
    let sysInfo = new Array;
    
    try{
      stats.push(`**Node.js** : v${process.versions.node}`);
      stats.push(`**Discord.js** : v${require("../../../package.json").dependencies["discord.js"].substr(1)}`);
      stats.push(`**Servers** : ${msg.client.guilds.cache.size}`);
      stats.push(`**Channels** : ${msg.client.channels.cache.size}`);
      stats.push(`**Users** : ${msg.client.guilds.cache.reduce((s, g) => s + g.memberCount, 0)}`)
      
      uptime.push(`**Client** : ${prettyMs(msg.client.uptime??0)}`);
      uptime.push(`**Host** : ${prettyMs(os.uptime())}`);
      uptime.push(`**Total** : ${prettyMs(os.uptime())}`);
      
      let data= process.memoryUsage();
      sysInfo.push(`**Memory** : ${formatMemory(data.rss)}MB | ${formatMemory(os.totalmem())}MB`);
      sysInfo.push(`**Total Heap** : ${formatMemory(data.heapTotal)}MB`);
      
      let cpu = require("os").cpus()[0].times;
      sysInfo.push(`**CPU Load** : ${(((cpu.user + cpu.nice + cpu.sys) / cpu.idle) * 100).toFixed(2)}%`);
      
    }
    catch(err){
      console.log(err);
      msg.channel.send('There was an error while getting statistics.');
    }
    finally{
      msg.channel.send({
        embeds:[{
          color :'#00bfff',
          // author:require('../../config.js').info,
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
            icon_url:msg.author.avatarURL({format:'png'})??undefined
          }
        }]
      }).catch(()=>{
        msg.reply('Found error while executing this command please send this to devloper. Bug reported to devloper');
      });
    };
  }
}
 

function formatMemory(size:number){
  return Math.round(size/1024/1024*100)/100;
}

