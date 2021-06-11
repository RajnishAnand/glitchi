const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const http = require('http');
const fetch = require('node-fetch');

const port = process.env.PORT || 3000;
const client = new Discord.Client();


client.once('ready', () => {
  console.log('Ready!');
});

client.login(token);

client.on('message', msg => {
  //repeatme(msg);
  //console.log(msg);
});

client.on('message', msg => {
  if (!msg.content[0]==prefix||msg.author.bot) return;
  let command=msg.content.substr(prefix.length).split(' ');
  
  switch (command.shift().toLowerCase()) {
    case 'ping':
      msg.channel.send('pong!');
      break;
    case 'beep':
      msg.channel.send('boop!');
    break;
        
    case 'hi':
    case 'hello':
      msg.reply(['Hi','Hello there!','Hello'][parseInt(Math.random()*3)]);
      break;
        
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
      if(!msg.channel.guild||true)break;
      msg.channel.send(guildinfo(msg));
      break;
      
    case 'repeat':
      msg.channel.send(command.join(' '));
      break;
    
    case 'fetch':
      fetchit(command[0],
        (data)=>{
          msg.channel.send('>>> ```\n'+data.substr(0,500)+'```'+`**full document** : https://cors-fetch-it.herokuapp.com/${command[0]}`);
        },
        (err)=>{
          msg.channel.send('>>> ```\n'+err.message+'```');
        }
     )
     break;
  };
});

http.createServer(server).listen(port);

//To launch server
function server(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('No info provided!');
}

//to fetch and call the function
function fetchit(link, func, error = () => {}) {
  fetch(link)
    .then(resp => resp.text())
    .then(d => func(d))
    .catch(err => error(err));
}


//To decorate <external-function>
function decor(deco, [initial, extreme] = ['', '']) {
  let txt = this;
  return txt = deco + initial + txt + extreme + deco;
};

//To return guild info 
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