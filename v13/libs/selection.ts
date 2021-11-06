import {
  MessageActionRow,
  MessageSelectMenu,
  Message
} from 'discord.js';

export default async function select(
    message : Message,
    input : SelectionType
  ){
  const id = ''+Date.now()+Math.random();
  const row = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId(id)
        .setPlaceholder(input.title)
        .addOptions(input.options)
    );
  
  const msg = await message.reply({
      content:input.content??'Please select any :',
      components:[row]
    });
  return await msg.awaitMessageComponent({
    componentType:'SELECT_MENU',
    time : 120000,
    filter(interaction){
      return interaction.customId==id && 
        interaction.user.id == message.author.id;
    }
  }).then(i=>{
    msg.delete()
    return i.values[0]
  }).catch(()=>{
    msg.delete();
    throw new Error('time out!');
  });
  
}

type SelectionType = {
  title : string,
  content ?: string,
  options : {
    label : string,
    description : string,
    value : string
  }[]
}