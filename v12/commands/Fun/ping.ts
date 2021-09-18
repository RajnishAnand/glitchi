import { argumentObjectType, message } from '../types';

class run{
  declare msg: message;
  constructor ({msg}: argumentObjectType){
    this.msg = msg;
    this.main()
  }
  main(){
    this.msg.react(global.config.emojis.dance);
    this.msg.channel.send(`${global.config.emojis.ping} pong!`)
      .then((sent: message)=>sent.edit(`${global.config.emojis.ping}|Pong! |Heartbeat : ${this.msg.client.ws.ping}ms |Roundtrip latency : ${sent.createdTimestamp-this.msg.createdTimestamp}ms.`))
  }
}

export default{
  name : 'ping',
  description : 'bot latency and heartbeat',
  args: false,
  // usage : string,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run : ({msg})=>{msg.reply('pomg')}
}
