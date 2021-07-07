module.exports = {
  name : 'serverinfo',
  description : 'server information',
  aliases : ['server'],
  usage : 'serverinfo',
  args : false,
  devOnly : false,
  execute({msg}){
    let embed = getData(msg.guild);
    msg.channel.send({embed});
  }
};

function getData(guild) {
  return {
    color : '#00bfff',
    title : guild.name,
    description : '```\n'+
      `Name : ${guild.name
      }\nID : ${guild.id
      }\nRegion : ${guild.region
      }\nMembers : ${guild.memberCount
      }\nOwnerID : ${guild.ownerID
      }\nVerification Level : ${guild.verificationLevel
      }`+'```',
  }
}
