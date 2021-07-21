import conf from '../../config';
module.exports = {
  name : 'help',
  description : 'List of all Commands!',
  aliases : ['commands','list'],
  usage : '[optional : command-name]',
  execute({msg,args,prefix}:any){
    const data = [];
    const {commands} = msg.client;
    const listIndex = "‣";
    
    if(!args.length){
      data.push(commands.filter((cmnd:any)=>!cmnd.devOnly).map((cmnd:any)=>`${listIndex} \`${prefix}${cmnd.name}\` ⇨ ${cmnd.description}`).join('\n'));
      data.push(`> You can use \`${prefix}help [command-name]\` to get info on a specific command!`);
      return msg.channel.send({embed:{
          color : '#00bfff',
          title : 'List of all Commands :',
          description : data.join('\n'),
          timestamp : new Date(),
          footer : {
            text: 'Requested by '+msg.author.username,
            icon_url:msg.author.avatarURL({format:'png'})
          },
      },split:true});
    }
    
    const name = args[0].toLowerCase();
    const command = commands.get(name) ||
      commands.find((cmnd:any)=>
        cmnd.aliases&&cmnd.aliases.includes(name));
    if(!command){
      return msg.reply(`<a:sadThink:854286456041242645> there is no such command as \`${name}\``).catch((err:any)=>console.log(err));
    }
    if(command.aliases)data.push(`${listIndex} **Aliases** ⇨ ${command.aliases.join(', ')}`);
    if(command.description)data.push(`${listIndex} **Description** ⇨ ${command.description}`);
    if(command.usage)data.push(`${listIndex} **Usage** ⇨ ${prefix}${command.name} ${command.usage}`);
    
    msg.channel.send({embed:{
      color:'#00bfff',
      author:conf.info,
      title : `Command : ${command.name}`,
      description : data.join('\n'),
      timestamp: new Date(),
      footer:{
        text: 'Requested by '+msg.author.username,
        icon_url:msg.author.avatarURL({format:'png'})
      },
    },split:true});
  }
}