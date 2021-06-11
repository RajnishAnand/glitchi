const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs');

const port = process.env.PORT || 3000;
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file=>file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.login(token);

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});