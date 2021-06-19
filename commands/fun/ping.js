module.exports = {
  name : 'ping',
  description : 'bot latency and heartbeat',
  args: false,
  execute({msg,client}){
    msg.react('855432117180432384');
    msg.channel.send(`<a:pingPong:855558851726409759> pong!`)
      .then(sent=>sent.edit(`<a:pingPong:855558851726409759>|Pong! |Heartbeat : ${client.ws.ping}ms |Roundtrip latency : ${sent.createdTimestamp-msg.createdTimestamp}ms.`))
  }
}