const Discord = require('discord.js');
const { prefix, ownerId } = require('./config.json');
const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 3000;
const client = new Discord.Client();

client.commands = new Discord.Collection();
//client.cooldown = new Discord.Collection();

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

const eventFiles = fs.readdirSync('./events').filter(file=>file.endsWith('.js'));

for (const file of eventFiles){
  const event = require(`./events/${file}`)
}


http.createServer(server).listen(port);
//To launch server
function server(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('No info provided!');
};

//To login
client.login(process.env.TOKEN);