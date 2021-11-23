import { argumentObjectType} from '../types';
import pageView from '#libs/pagination';
import {encode,decode} from 'xmorse';

function run({msg, args, content}:argumentObjectType){
  msg.reply(args.shift()??'F');
  msg.reply(content());
}

export default {
  name : 'morse',
  description : 'a morse convertor',
  // aliases : [string],
  usage : '[...text]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['encode','decode'],
  run
}