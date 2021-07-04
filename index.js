const port = process.env.PORT || 3000;
const Discord = require('discord.js');
const http = require('http');
const fs = require('fs');

const client = new Discord.Client();
require('discord-buttons')(client);
client.commands = new Discord.Collection();

//command handler
const commandFolders = fs.readdirSync('./commands');
for(const folder of commandFolders){
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file=>file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }; 
};

//event handler
const eventFiles = fs.readdirSync('./events').filter(file=>file.endsWith('.js'));
for (const file of eventFiles){
  const event = require(`./events/${file}`);
  if(event.once)client.once(event.name,(...args)=>
    event.execute(...args,client));
  else client.on(event.name,(...args)=>
    event.execute(...args,client));
};

http.createServer(server).listen(port);
//To launch server
function server(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('Glichi successfully waked up!');
};

//To login
client.login(process.env.TOKEN);