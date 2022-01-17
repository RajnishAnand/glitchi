import {Message} from "discord.js";

export default async function ask(msg: Message,question : string,filter:(mm : Message)=>boolean = (mm)=>mm.author.id == msg.author.id){
  try{
    const m0 = await msg.reply({
      content:question,
      failIfNotExists : false
    });
    const answer = await msg.channel.awaitMessages({
      filter ,
      max : 1,
      time : 120000
    })
    m0.delete();
    return answer.first()?.content;
  }
  catch(err){
    return false
  }
}
