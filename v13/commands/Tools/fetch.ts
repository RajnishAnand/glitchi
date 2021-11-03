import { argumentObjectType,} from '../types';
import fetch from 'node-fetch';
import {inspect} from 'util';
import {parse} from 'content-type';
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
  let raw = args.includes('raw') &&
    args.splice(args.indexOf('raw',1));
  let response = '';
  let title:string|undefined;
  args[1]=args[1]?args[1].toLocaleLowerCase():'-g';
  
  if(args[1]=='-g'||args[1]=='--get') {
    [response,title]= await GET(args[0])
  }
  
  else if(args[1]=='-p'||args[1]=='--post'){
    const json = codeBlockParser(content().replace(/[­ ]/g,'')).code;
    if(!json) return msg.reply('Please also include JSON you wanna POST in a codeBlock!');
    try{JSON.parse(json)}
    catch(err:any){return msg.reply(err.message)};
    
    [response,title] = await POST(args[0],json)
  }

  else if(args[1]=='-h'||args[1]=='--headers'){
    [response,title] = await Headers(args[0]);
  }
  
  const langGuess = parse(title??'').type.split('/')[1];
  new pageView(msg,response,{code:langGuess,title});
}


/////////////////////////////////////////////////

async function Headers(url:string) {
  const response = await fetch(url)
    .then(resp=>resp.headers)
    .then(obj => inspect(obj))
    .catch(err=>err.message);
  return [response,'application/javascript'];
}

async function GET(url:string) {
  const response = await fetch(url)
    .then(async r=>[await r.text(),r.headers.get('content-type')])
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
    .then(async r=>[await r.text(),r.headers.get('content-type')])
    .catch(err=>err.message);
  return response;
}





