import { argumentObjectType, message } from '../types';
import {TextChannel} from 'discord.js';
//import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args,content}: argumentObjectType){
    this.msg = msg;
    this.main(args,content)
  }
  async main(args:string[], content:string){
    let channel = args[0]
      .replace(/^<#/,'')
      .replace(/>$/,'');
     
    try{
      (this.msg.client.channels.cache.get(channel) as TextChannel).send(content.replace(args[0],''));
      this.msg.channel.send(`your was message successfully sent to ${this.msg.client.channels.cache.get(channel)}!`); 
    }
    catch (err){
      //console.log(args,parseInt(args[0]));
      this.msg.channel.send(err.message);
      //console.log(args[0],msg.client.channels.cache)
    };
  }
}

export default {
  name:'msg',
  description : 'message to channel',
  alisaes:['message'],
  args : true,
  devOnly : true,
  // usage : string,
  // permissions : string,
  // permRequired : [string],
  run
}
