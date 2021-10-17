import { argumentObjectType} from '../types';
import pageView from '../../libs/pagination';
import npmSearch from '../../APIs/npm';

function run({msg, content}:argumentObjectType){
  npmSearch(content())
    .then(t=>new pageView(msg,t))
    .catch(()=>msg.reply(global.config.emojis.sad+' Any relevant search result not found!'))
}

export default {
  name : 'npm',
  description : 'search for npm packages',
  // aliases : [string],
  usage : '[...query]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['react','discord.js'],
  run
}