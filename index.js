const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const http = require('http');
const port = process.env.PORT || 3000;
const client = new Discord.Client();


client.once('ready', () => {
  console.log('Ready!');
});

client.login(token);

client.on('message', msg => {
  //console.log(msg);
});

client.on('message', msg => {
  if (msg.content[0]==prefix) {
  switch(msg.content.substr(prefix.length).toLowerCase()){
      case 'ping':
        msg.channel.send('pong.');
        break;
      case 'hi':
      case 'hello':
        msg.reply(`Hi`);
        break;
      case 'how are you':
      case 'how are you ?':
      case 'hru':
        msg.channel.send('All my parts seems to be 🙃 non-glitchy for now!\\🐥');
        break;
      case 'all-info':
        msg.channel.send(`\`\`\`json\n${JSON.stringify(msg)}\`\`\``);
        break;
      case 'server-info':
      case 'guild-info':
      case 'serverinfo':
      case 'guildinfo':
        let dt = new Date(msg.channel.guild.joinedTimestamp);
        msg.channel.send(`>>> **Guild info**\`\`\`md\nName : ${
            msg.channel.guild.name
          }\nRegion : ${
            msg.channel.guild.region
          }\nMembers : ${
            msg.channel.guild.memberCount
          }\nCreated : ${
            dt.toString()
          }\`\`\``);
        break;
    };
  };
});


http.createServer(server).listen(port);
function server(req,res){
  res.writeHead(200,{
    'Content-Type': 'text/plain',
  });
  res.end('No info provided!');
}