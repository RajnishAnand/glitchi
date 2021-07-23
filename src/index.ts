const port = process.env.PORT || 3000;
import Discord from 'discord.js';
import http from 'http';
import fs from 'fs';

const client:any = new Discord.Client();
require('discord-buttons')(client);
client.commands = new Discord.Collection();

//command handler
const commandFolders = fs.readdirSync(__dirname+'/commands');
for(const folder of commandFolders){
  const commandFiles = fs
    .readdirSync(__dirname+`/commands/${folder}`)
    .filter((file:any)=>file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(__dirname+`/commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }; 
};

//event handler  
const eventFiles = fs.readdirSync(__dirname+'/events').filter((file:any)=>file.endsWith('.js'));
for (const file of eventFiles){
  const event = require(__dirname+`/events/${file}`);
  if(event.once)client.once(event.name,(...args:any)=>
    event.execute(...args,client));
  else client.on(event.name,(...args:any)=>
    event.execute(...args,client));
};


http.createServer(server).listen(port);
//To launch server
function server(req:any, res:any) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(
    'An Open Source Discord bot!\n\nGithub : https://github.com/RajnishAnand/discord-bot-glitchi\nGlitchi Support server : https://discord.gg/ZARyCT3a7G \n\nInvite Bot : https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot&permissions=4161666295 '
    );
};

//To login
if(process.env.TOKEN){
  client.login(process.env.TOKEN);
}else{
  console.log('⚠️ TOKEN NOT FOUND ⚠️: expected token returned undefined. \nIf you are running locally use `npm run dev`\n');
  process.exit(0);
};