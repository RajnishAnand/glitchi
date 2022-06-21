import {Command} from 'Interfaces';

const gifs:{[index:string]:string} = {
  slap: "https://media.discordapp.net/attachments/906985861525155880/967325447354466335/BJ8o71tD-.gif",
  mustachedisguise : "https://c.tenor.com/wM7CU3pwFIsAAAAM/moustache-disguise.gifs",
  sleeperattack: "https://c.tenor.com/NkCXPaCEdAgAAAAM/shoe-throw.gif",

}

export const command:Command = {
  name: "gif",
  description: "sends custom picked gifs",
  aliases: ["."],
  args: true,
  usage: "<gifName>",
  examples: ["slap"],
  roleAccess: "betaTesters",

  run({msg,args}){
    if(!args.length){
      msg.reply({
        allowedMentions: {repliedUser:false},
        content: `__**Avaliable Gifs :**__\n${Object.keys(gifs)}`
      })
    }
    else{
      if(args[0] in gifs){
        msg.channel.send(gifs[args[0]]);
      }
      else {

      }
    }
  }
}
