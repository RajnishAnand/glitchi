const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const http = require('http');

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
  switch(msg.content.substr(1).toLowerCase()){
      case 'ping':
        msg.channel.send('pong.');
        break;
      case 'hi':
      case 'hello':
        msg.channel.send(`Hi @${msg.author.username}#${msg.author.discriminator}`);
        break;
      case 'how are you':
      case 'how are you ?':
      case 'hru':
        msg.channel.send('All my parts seems to be 🙃 non-glitchy for now!\\🐥');
        break;
      
      case 'all-info':
        msg.channel.send(`\`\`\`json\n${JSON.stringify(msg)}\`\`\``);
        break;
        
    };
  };
});

http.createServer(server).listen(process.env.PORT || 3000);

function server(req,res){
  res.writeHead(200,{
    'Content-Type': 'text/plain',
  });
  res.end('No info provided!');
}