module.exports = {
  name : 'serverinfo',
  description : 'server information',
  usage : 'serverinfo',
  args : false,
  devOnly : false,
  execute({msg}){
    msg.channel.send(guildinfo(msg));
  }
};

function guildinfo(msg) {
  let dt = new Date(msg.channel.guild.joinedTimestamp);
  return `>>> **Guild info**\`\`\`md\nName : ${
    msg.channel.guild.name
    }\nRegion : ${
      msg.channel.guild.region
    }\nMembers : ${
      msg.channel.guild.memberCount
    }\nCreated : ${
      dt.toString()
    }\`\`\``;
}