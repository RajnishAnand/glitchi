import {Command} from 'Interfaces';
import { embedPagination } from '#libs';
import mdnSearch from '#api/mdn.js';

export const command : Command = {
  name : 'mdn',
  description : 'search from mdn',
  usage : '...<query>',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['AJAX','fetch'],
  run ({msg,content}){
    mdnSearch(content())
      .then(t=>new embedPagination(msg,t.map(k=>k.embedify())))
      .catch(()=>msg.reply(msg.client.config.emojis.sad+' Any relevant search result not found!'))
  }
}
