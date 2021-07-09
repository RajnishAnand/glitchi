const { prefix, ownerId ,channels} = require('../config.json');
module.exports = {
  name: 'message',
  execute(msg) {
    if (!msg.content.startsWith(prefix) ||
      msg.author.bot ||
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
    const command = msg.client.commands.get(commandName) ||
      msg.client.commands.find(cmnd => cmnd.aliases && cmnd.aliases.includes(commandName));

    if (!command) {
      switch (commandName) {
        case 'ping':
          msg.channel.send('pong!');
          break;
        case 'beep':
          msg.channel.send('boop!');
          break;

        case 'hi':
        case 'hello':
          msg.reply(['Hi', 'Hello there!', 'Hello'][parseInt(Math.random() * 3)]);
          break;

        case 'hru':
          msg.channel.send('Sometime i get bored alone <:emoji_7:852714216057733180> and my system goes idle! but right now I\'m absolutely fine.\\🐥');
          break;
      };
      return;
    };
    
    if (command.permissions) {
      const authorPerms = msg.channel
        .permissionsFor(msg.author);
      if (!authorPerms ||
        !authorPerms.has(command.permissions)) {
        return msg.reply(`<a:cuteness:854833240665227324> You require PERMISSION : **\` ${command.permissions} \`** to run \` ${commandName} \` command!`);
      }
    }
    try {
      if ((command.devOnly || false) == true &&
        (msg.author.id != ownerId) == true) {
        return;
      }
      else if (command.args && !args.length) {
        msg.channel.send(`Command : \` ${command.name} \` requires argument! <:sneakPeek:852714216057733180> ${msg.author}`);
      }
      else {
        const content = msg.content
          .substr(prefix.length)
          .replace(/^[\s+]?/, "")
          .replace(commandName + ' ', '');
        command.execute({ msg, args, content, commandName, prefix, error:this.err });
      }
    } catch (error) {
      msg.reply(error.message);
    }
  },
  err(msg,err) {
    msg.client.channels.cache.get(channels.errorLog).send(`>>> \` User : ${msg.author.tag
        } \n Guild : ${msg.guild.name
        } \n Channel : \`<#${msg.channel.id
        }>\n\` error : ${err.message
        } \n Command :\` \`${msg.cleanContent}\``);
  }
}