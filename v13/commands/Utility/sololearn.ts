import { argumentObjectType} from '../types';
import pageView from '../../libs/pagination';
import hotToday from '../../APIs/@sololearn/hotToday';

function run({msg}:argumentObjectType){
  hotToday()
    .then(t=>new pageView(msg,t))
    .catch(()=>msg.reply('An Unknown Error Occured while getting hotToday codes!'))
}

export default {
  name : 'sololearn',
  description : 'sololearn',
  aliases : ['sl'],
  usage : '[...query]',
  args : false,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  // examples : ['AJAX','fetch'],
  run
}