import {codeBlockParser,pageView} from '#libs';
import {MessageEmbed} from 'discord.js';
import { Command } from 'Interfaces';


export const command:Command = {
  name: 'embed',
  description: 'convert your json-code to Embed',
  args: true,
  usage: "<json-Embed>",
  
  run({msg,content}){
    let txt = content().replace(/[­ ]/g,'');
    txt = codeBlockParser(txt).code??txt;

    try{
      let obj = JSON.parse(txt);
      obj = new MessageEmbed(obj);
      // if (!Array.isArray(obj))
      msg.reply({
        embeds:[obj],
        allowedMentions:{repliedUser:false}
      }).catch(e=>{
        new pageView(msg,e.message,{
            code:"js",
            title:"EmbedError"
        })
      })
    }
    catch(err:any){
      new pageView(msg,err.message,{code:'JSON_ERROR'});
    }
    
    //msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a  **"code-block"**');
  }
}
