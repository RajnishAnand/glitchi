import { argumentObjectType} from '../types';
import pageView from '#libs/pagination';
import morseNode from 'morse-node';

const morse = morseNode.create('ITU');

function run({msg, args, content}:argumentObjectType){
  let text : string;
  
  if(args[0].toLowerCase()=='en'||
    args[0].toLowerCase()=='de'||
    args[0].toLowerCase()=='decode'||
    args[0].toLowerCase()== 'encode')
    text = content().replace(args[0].toLowerCase(),'');
  else text = content();
  
  if(args[0].toLowerCase()=='decode'||
    args[0].toLowerCase()=='de')
    new pageView(msg,morse.decode(text));
  else new pageView(msg,morse.encode(text),
    {
      code:'morse',
      title:'MORSE [ITU Standard]',
    })
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