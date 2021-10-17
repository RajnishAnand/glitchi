import { argumentObjectType,} from '../types';
import fetch from 'node-fetch';
import {inspect} from 'util';
import pageView from '../../libs/pagination/index';

function run ({msg,args}:argumentObjectType){
  if(args[1]=='-h'||args[1]=='--headers')
    return fetch(args[0])
      .then(resp=>resp.headers)
      .then(obj => inspect(obj))
      .then(txt=>
        new pageView(msg,txt,{code:'javascript'}))
      .catch(err=>msg.reply('```\n'+err.message+'```'));
      
  async function fetchit(link:string){
    let txt = await fetch(link).then(r => r.text())
      .catch((err:Error) => err.message);
    return txt;
  }
  
  fetchit(args[0]).then((d:string)=>{
    let langGuess = (d.startsWith('<!'))?'html':(d.startsWith('{')&&d.endsWith('}'))?'json':'';
    new pageView(msg,d,{code:langGuess});
  })
}

export default {
  name : 'fetch',
  description : 'To fetch any URL .',
  usage : '[url]',
  args : true ,
  // aliases : [string],
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}



