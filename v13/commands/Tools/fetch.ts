import { argumentObjectType,} from '../types';
import fetch from 'node-fetch';
import {inspect} from 'util';
import pageView from '../../libs/pagination/index';
import codeBlockParser from '../../libs/codeBlock-parser';

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

async function run ({msg,args, content}:argumentObjectType){
  let response = '';
  args[1]=args[1]?args[1].toLocaleLowerCase():'-g';
  
  if(args[1]=='-g'||args[1]=='--get') {
    response = await GET(args[0])
  }
  
  else if(args[1]=='-p'||args[1]=='--post'){
    const json = codeBlockParser(content().replace(/[­ ]/g,'')).code;
    if(!json) return msg.reply('Please also include JSON you wanna POST in a codeBlock!');
    try{JSON.parse(json)}
    catch(err:any){return msg.reply(err.message)};
    
    response = await POST(args[0],json)
  }

  else if(args[1]=='-h'||args[1]=='--headers'){
    return fetch(args[0])
      .then(resp=>resp.headers)
      .then(obj => inspect(obj))
      .then(txt=>
        new pageView(msg,txt,{code:'javascript'}))
      .catch(err=>msg.reply('```\n'+err.message+'```'));
  }

  const langGuess = (response.startsWith('<!'))?'html':(response.startsWith('{'))?'json':'';
  new pageView(msg,response,{code:langGuess});
}


/////////////////////////////////////////////////

async function GET(url:string) {
  const response = await fetch(url)
    .then(r=>r.text())
    .catch(err=>err.message);
  return response
}

async function POST(url:string, json:string) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE,
    headers: {'Content-Type': 'application/json'},
    redirect: 'follow', 
    body: json
  })
    .then(r=>r.text())
    .catch(err=>err.message);
  return response;
}





