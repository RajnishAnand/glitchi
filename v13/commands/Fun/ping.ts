import { argumentObjectType } from '../types';
import pageView from '../../libs/pagination'

export default{
  name : 'ping',
  description : 'bot latency and heartbeat',
  args: false,
  // usage : string,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run({msg}:argumentObjectType){
    msg.channel.send(`pong!`)
      .then((sent)=>sent.edit(`${global.config.emojis.dance}|Pong! |Heartbeat : ${msg.client.ws.ping}ms |Roundtrip latency : ${sent.createdTimestamp-msg.createdTimestamp}ms.`));
  }
}
