import {Message} from "discord.js";
import {Command} from "Interfaces";

export const command : Command = {
  name : 'ping',
  description : 'bot latency and heartbeat',
  args: false,
  run({msg}){
    msg.channel.send(`pong!`)
      .then((sent:Message)=>sent.edit(`${msg.client.config.emojis.dance}|Pong! |Heartbeat : ${msg.client.ws.ping}ms |Roundtrip latency : ${sent.createdTimestamp-msg.createdTimestamp}ms.`));
  }
}
