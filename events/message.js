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
    const content = msg.content.replace(prefix + commandName + ' ', '');
    const command = client.commands.get(commandName) ||
      client.commands.find(cmnd => cmnd.aliases && cmnd.aliases.includes(commandName));

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
        return msg.reply('<a:cuteness:854833240665227324> You don\' have enough privilege to delete messages!');
      }
    }
    try {
      if (command.args && !args.length) {
        msg.channel.send(`This command requires argument <:sneakPeek:852714216057733180> ${msg.author}`);
      }
      else if ((command.devOnly || false) == true &&
        (msg.author.id != ownerId) == true) {
        msg.channel.send('This command is reserved for bot owner only!')
      }
      else {
        command.execute({ msg, args, content, client });
      }
    } catch (error) {
      //onsole.error(error);
      msg.reply(error.message);
    }
  }
}