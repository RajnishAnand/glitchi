const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs');

const port = process.env.PORT || 3000;
const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', () => {
  console.log('Ready!');
});

client.login(token);

client.on('message', msg => {
  //repeatme(msg);
  //console.log(msg);
});

client.on('message', msg => {
  if (!msg.content[0]==prefix||msg.author.bot||!msg.channel.hasOwnProperty('guild')) return;
  
  let command=msg.content.substr(prefix.length).split(/ +/);
  
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
      msg.channel.send('Sometime i get bored alone <:emoji_7:852714216057733180> and my system goes idle! but right now I\'m absolutely fine.\\🐥');
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
          msg.channel.send(embed({
            'title':'Fetched document :',
            'description' : '```\n'+data.substr(0,500)+'```',
            'fields' : [
              {
                'name' : 'Full document :',
                'value': `https://cors-fetch-it.herokuapp.com/${command[0]}`
              },
            ],
          }));
        },
        (err)=>{
          msg.channel.send(embed({
            'title':'Failed to fetch',
            'description':'`'+err.message+'`',
          }));
        }
      )
      break;
     
    case 'a':
    case 'avatar' :
      //console.log(msg.mentions.users);
      if(command.length){
        if(msg.mentions.users.size){
          msg.channel.send(embed({
            'title':msg.mentions.users.first().username+'#'+msg.mentions.users.first().discriminator,
            'image':msg.mentions.users.first().displayAvatarURL({
                format : 'png',
                dynamic : 'true',
              })+'?size=2048',
          }))
        };
      }
      else{
        msg.channel.send(embed({
          'title':msg.author.username+'#'+msg.author.discriminator,
          'image' : `${msg.author.displayAvatarURL({
            format:'png',
            dynamic:true,
          })}?size=2048`
        }))
      };
      break;
    
    case 'bulk-delete':
      if(msg.author.id==800445583046213663){
        let amount = parseInt(command[0])
        if(!isNaN(amount)){
          msg.channel.bulkDelete(amount,true)
            .catch(err=>msg.channel.send(err.message));
        }
        else{
          masg.channel.send('unable to resolve integer from string`'+command[0]+'`');
        };
      }
      else{
        msg.channel.send('Command reserved for devloper!')
      };
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

function embed(obj){
  let embd= new Discord.MessageEmbed()
    .setColor('#00bfff')
    
    if('title' in obj)embd.setTitle(obj.title);
    if('description' in obj)embd.setDescription(obj.description);
    if('fields' in obj)embd.addFields(obj.fields);
    if('image' in obj)embd.setImage(obj.image);
    
    embd.setTimestamp();
    embd.setFooter('Glitchi', 'https://cdn.discordapp.com/avatars/852227150455373906/2f06054bcc4e7cea81c975f97849eb91.png')
    
  return embd;
}
