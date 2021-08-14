import fs from 'fs';
module.exports = {
  name : 'reload',
  description : 'Reload specified commad.',
  usage : '[commad-name]',
  args : true,
  devOnly : true,
  execute({msg,args}:any){
    const commandName = args[0].toLowerCase();
    const command = msg.client.commands
      .get(commandName ||
        msg.client.commands.find((cmd:any)=>cmd.aliases&&cmd.aliases.includes(commandName)));
    
    if(!command){
      return msg.reply(`<a:sadThink:854286456041242645> there are no such command as \`${commandName}\``);
    }
    
    const commandFolders = fs.readdirSync('./commands')
    const folderName = commandFolders.find(folder=>
      fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));
    delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
    
    try{
      const newCommand = require(`../${folderName}/${command.name}`);
      msg.client.commands.set(newCommand.name, newCommand);
	    msg.channel.send(`Command \`${newCommand.name}\` was reloaded successfully!`);
    }
    catch(err){
      msg.channel.send(`there was an error while reloading a command \`${command.name}\`:\n\`${err.message}\``);
    }
  }
}