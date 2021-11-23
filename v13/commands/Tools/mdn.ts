import { argumentObjectType} from '../types';
import pageView from '#libs/pagination';
import mdnSearch from '#api/mdn.js';

function run({msg, content}:argumentObjectType){
  mdnSearch(content())
    .then(t=>new pageView(msg,t))
    .catch(()=>msg.reply(global.config.emojis.sad+' Any relevant search result not found!'))
}

export default {
  name : 'mdn',
  description : 'search from mdn',
  // aliases : [string],
  usage : '[...query]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['AJAX','fetch'],
  run
}