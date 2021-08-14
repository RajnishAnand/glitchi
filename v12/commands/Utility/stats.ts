import { argumentObjectType, message } from '../types';
import prettyMs from 'pretty-ms';
import os from 'os';
//import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  declare error :(a:message,b:Error)=>null;
  constructor ({msg,args,error}: argumentObjectType){
    this.msg = msg;
    this.error=error;
    this.main(args)
  }
  async main(args:string[]){
    let stats = new Array;
    let uptime = new Array;
    let sysInfo = new Array;
    
    try{
      stats.push(`**Node.js** : v${process.versions.node}`);
      stats.push(`**Discord.js** : v${require("../../../package.json").dependencies["discord.js"].substr(1)}`);
      stats.push(`**Servers** : ${this.msg.client.guilds.cache.size}`);
      stats.push(`**Channels** : ${this.msg.client.channels.cache.size}`);
      stats.push(`**Users** : ${this.msg.client.users.cache.size}`)
      
      uptime.push(`**Client** : ${prettyMs(this.msg.client.uptime??0)}`);
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
      this.msg.channel.send('There was an error while getting statistics.');
    }
    finally{
      this.msg.channel.send({
        embed:{
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
            text: 'Requested by '+this.msg.author.username,
            icon_url:this.msg.author.avatarURL({format:'png'})
          }
        }
      }).catch((err:any)=>{
        this.error(this.msg,err);
        this.msg.reply('Found error while executing this command please send this to devloper. Bug reported to devloper');
      });
    };
  }
  
  formatMemory(size:number){
    return Math.round(size/1024/1024*100)/100;
  }
}

export default {
  name:'stats',
  description : 'statistics of bot',
  aliases: ['statistics','sts'],
  // usage : string,
  // args : boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}