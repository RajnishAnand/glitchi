import fetch from 'node-fetch';
const url='https://developer.mozilla.org/api/v1/search?q=';

//TODO : Test by changing url if err occurs or if a security vulnerability
export default async function mdn (query:string){
  let resp = await fetch(url+encodeURI(query))
    .then(r=>r.json());
  if(!resp.documents.length)throw Error('Any relevant search result not found!');
  
  resp = resp.documents.map((r:{
    mdn_url:string,
    summary:string,
    title:string
  })=>{return {
    author:{
      name : 'MDN Web Docs',
      iconURL:'https://developer.mozilla.org/favicon-48x48.97046865.png',
    },
    title:r.title,
    url:'https://developer.mozilla.org'+r.mdn_url,
    color:'#000000',
    description:r.summary,
    timestamp:new Date()
  }})
  
  return resp;
}
