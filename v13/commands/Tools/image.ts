import { argumentObjectType} from '../types';
import pageView from '#libs/pagination';
import imgs from '#api/unsplash.js';

export default {
  name : 'image',
  description : 'search for image from unplash',
  aliases : ['img'],
  usage : '[...query]',
  args : true,
  // permissions : string,
  devOnly : true,
  // permRequired : [string],
  // examples : [''],
  run
}

function run({msg, content}:argumentObjectType){
  imgs(content())
    .then(t=>new pageView(msg,t))
    .catch(()=>msg.reply(global.config.emojis.sad+' Any relevant search result not found!'))
}

