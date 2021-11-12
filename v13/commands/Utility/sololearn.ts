import { argumentObjectType} from '../types';
import pageView from '../../libs/pagination';
import hotToday from '../../APIs/@sololearn/hotToday';
import trending from '../../APIs/@sololearn/trending';

function run({msg,args}:argumentObjectType){
  if(args[0]=='hot')hotToday()
    .then(t=>new pageView(msg,t))
    .catch(()=>msg.reply('An Unknown Error Occured while getting hotToday codes!'));
  else trending()
    .then(t => new pageView(msg, t))
    .catch(() => msg.reply('An Unknown Error Occured while getting trending codes!'));
}

export default {
  name : 'sololearn',
  description : 'sololearn',
  aliases : ['sl'],
  usage : '[...query]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  // examples : ['AJAX','fetch'],
  run
}