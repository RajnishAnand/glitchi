const Discord = require('discord.js');
const { prefix, token, ownerId } = require('./config.json');
//const http = require('http');
//const fetch = require('node-fetch');
const fs = require('fs');

const port = process.env.PORT || 3000;
const client = new Discord.Client();
client.commands = new Discord.Collection();

//To get list of commandfolders
const commandFolders = fs.readdirSync('./commands');

//To acquire all available commands
for(const folder of commandFolders){
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file=>file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
};

//login token
client.login(token);

//Client on ready console ready
client.once('ready', () => {
  console.log('Ready!');
});

//client on message
client.on('message', (msg)=> {
  if (!msg.content.startsWith(prefix) || 
      //msg.author.bot||
      !msg.channel.hasOwnProperty('guild')
  ) return;
  const args = msg
    .content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args
    .shift()
    .toLowerCase();
  
  if (!client.commands.has(commandName)){
    switch (commandName){
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
      msg.channel.send('Sometime i get bored alone <:emoji_7:852714216057733180> and my system goes idle! but right now I\'m absolutely fine.\\🐥');
      break;
    };
    return;
  };
  
  try {
    const command = client
      .commands
      .get(commandName);
    
    if(command.args&&!args.length){
      msg
        .channel
        .send(`This command requires argument <:emoji_7:852714216057733180> ${msg.author}`);
    }
    else if ((command.devOnly||false)&&msg.author.id!=ownerID){
        msg.channel.send('Command reserved for bot owwner only!');
    }
    else command.execute(msg, args);
  } catch (error) {
    //console.error(error);
    msg.reply(error.message);
  }
});