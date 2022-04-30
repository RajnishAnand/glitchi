import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
const url='https://developer.mozilla.org/api/v1/search?q=';

export default async function mdn (query:string){
  const resp = await fetch(url+encodeURI(query))
    .then(r=>r.json());
  if(!resp.documents.length)throw Error('Any relevant search result not found!');
  
  const data:mdnResponse[]= resp.documents.map((r:mdnAPIResponse)=>{
    return {
      value : {
        title: r.title,
        summary: r.summary,
        mdn_url:'https://developer.mozilla.org'+ r.mdn_url
      },
      embedify(){
        return new MessageEmbed({
           author:{
             name : 'MDN Web Docs_',
             iconURL:'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
           },
           title:this.value.title,
           url:this.value.mdn_url,
           color:'#15141a',
           description:this.value.summary,
           timestamp:new Date()
        });
      }
    }
  })
  
  return data
}

interface mdnResponse{
  value :mdnAPIResponse;
  embedify:()=>MessageEmbed;
}

interface mdnAPIResponse{
  mdn_url:string,
  summary:string,
  title:string,
}
