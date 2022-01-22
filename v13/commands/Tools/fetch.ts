import fetch from 'node-fetch';
import {inspect} from 'util';
import {parse} from 'content-type';
import {Util} from 'discord.js';
import {ask,select,pageView,codeBlockParser} from '#libs'
import {Command, CommandArgument} from 'Interfaces';

export const command: Command= {
  name : 'fetch',
  description : 'To fetch any URL .',
  usage : '<url> ?<--get||--post||--headers> ?<raw> ?<post_text>',
  args : true ,
  examples :['http://example.com/'] ,
  run
}

const types = [
  'plain/text',
  'application/xml',
  'application/json',
  'application/x-www-form-urlencoded'
];

async function run ({msg,args, content}:CommandArgument){
  const raw = (args[1]=='raw' && args.splice(1,1)) || args[2]=='raw';
  
  let response = '';
  let title:string|undefined;
  if(!args[1]||!args[1].startsWith('-'))args.splice(1,0,'-g');
  
  if(args[1].toLowerCase()=='-g'||args[1].toLowerCase()=='--get') {
    [response,title]= await GET(args[0])
  }
  
  else if(args[1].toLowerCase()=='-p'||args[1].toLowerCase()=='--post'){
      let {code,lang}= codeBlockParser(content().replace(/[­ ]/g,''));
    if(!code){
      return msg.reply('Please also include body/text you wanna POST in a codeBlock !')
    }
    if(lang == 'json'){
      try{JSON.parse(code)}
      catch(err:any){return msg.reply(err.message)};
    }
    else if(!lang || !types.includes(lang)){
      try{
        lang = await select(msg,{
          content :'Please pick a supported content type:',
          title : 'Select content-type',
          options : [ ...types.map(z=>{return {
            label : z,
            description :`set request body format as ${z}`,
            value : z
          }}),{
            label: "Other",
            description: "custom content type",
            value : "none"
          }]
        });
        if(lang=="none"){
          const ans = await ask(msg,"Enter your custom content type :");
          if(!ans)return msg.channel.send("Time Out! Command Cancelled.");
          lang=ans;
        }
      } catch(err:any){ return msg.reply(err.message) };
    };
    
    [response,title] = await POST(args[0],code,lang)
  }

  else if(args[1].toLowerCase()=='-h'||args[1].toLowerCase()=='--headers'){
    [response,title] = await Headers(args[0]);
  }
  else{
    return msg.reply(`*__${args[1].replace(/([\*\`\~\_])/g,'\\$1')}__* isn't a valid flag. Currently it only supports :\n   • \`[ -p ]\` or \`[ --post ]\` : POST REQUEST\n   • \`[ -g ]\` or \`[ --get ]\` : GET REQUEST (Default)\n   • \`[ -h ]\` or \`[ --headers ]\` : GET HEADERS`)
  } //`
  //type = type.includes('+')?type.split("+")[0]:type.split("/")[1]
  let langGuess = parse(title??'').type.split('/')[1];
  if(!raw && langGuess=='json') {
    try{
      response = inspect(JSON.parse(response),{depth:Infinity});
      langGuess= 'js';
    }catch(err){}
  }
  if(raw){
    Util.splitMessage('```'+langGuess+'\n'+(response.replace(/```/g,'``­`' ))+' ```',{
      prepend:'```'+langGuess+'\n',
      append : '```',
      char : '',
      maxLength : 1950
    }).forEach(e=>msg.channel.send(e));
  }
  else new pageView(msg,response,{code:langGuess,title});
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
    .catch(err=>[err.message,'plain/text']);
  return response
}

async function POST(url:string,data:string,type:string) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE,
    headers: {'Content-Type':type},
    redirect: 'follow', 
    body: data
  })
    .then(async r=>[await r.text(),r.headers.get('content-type')])
    .catch(err=>[err.message,'plain/text']);
  return response;
}





