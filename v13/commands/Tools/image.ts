import pageView from '#libs/pagination';
import imgs from '#api/unsplash.js';
import {Command} from 'Interfaces';

export const command : Command = {
  name : 'image',
  description : 'search for image from unplash',
  aliases : ['img'],
  usage : '...<query>',
  args : true,
  // permissions : string,
  devOnly : true,
  // permRequired : [string],
  examples : ['clock'],
  run({msg,content }){
    imgs(content())
      .then(t=>new pageView(msg,t))
      .catch(()=>msg.reply(msg.client.config.emojis.sad+' Any relevant search result not found!'))
   }

}

 
