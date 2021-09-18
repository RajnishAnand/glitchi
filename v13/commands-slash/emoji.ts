import { CommandInteraction, Emoji } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default{
  data : new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('sends emoji for you!')
    .addStringOption((opt)=>
      opt.setName('query')
        .setDescription('emoji name to query')
        .setRequired(true))
    .toJSON(),
    
  run(interaction:CommandInteraction){
    const q=interaction.options.getString('query') as string;
    let e = interaction.client.emojis.cache.find(f=> 
      new RegExp(`^${q}`,'i').test(f.name||''));
    if(!e) e = interaction.client.emojis.cache.find(f=>
      new RegExp(q,'i').test(f.name||''));
    if(!e) return interaction.reply({
      content : 'Your specified emoji not found!',
      ephemeral : true
    })
    interaction.reply(e.toString());
  }
}


interface emote{
  id:string,
  name:string,
  a:boolean
}