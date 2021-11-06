import fetch from 'node-fetch';
const search='https://registry.npmjs.org/-/v1/search?size=10&text=';
export default async function npmSearch(query:string){
  let resp = await fetch(search+encodeURI(query))
    .then(r=>r.json());
  
  if(!resp.total)throw Error('Any relevant search result not found!');
  
  resp = resp.objects.map((r:any)=>{
    const author = `${r.package.author?`\n‣ **Author :** ${r.package.author.username?`[${r.package.author.name}](https://www.npmjs.com/~${r.package.author.username})`:r.package.author.name}`:''}\n`;
    
    const publisher = `‣ **Publisher :** [${r.package.publisher.username}](https://www.npmjs.com/~${r.package.publisher.username})\n`;
    
    const large= r.package.maintainers.length>15&&
      (r.package.maintainers.length=15);
    const maintainers = `‣ **Maintainer(s) :** \n${r.package.maintainers.map((m:any)=>`    ⌙ [${m.username}](https://www.npmjs.com/~${m.username})`).join('\n')}${large?'...':''}`;
    
    const keywords = `${r.package.keywords?`\n>>> **Keywords :** ${r.package.keywords.join(', ')}`:''}`;
    
    return {
      author:{
        name:'npm',
        iconURL:'https://static.npmjs.com/f1786e9b7cba9753ca7b9c40e8b98f67.png'
      },
      color:'#fa4704',
      title:r.package.name,
      url:r.package.links.npm,
      description:r.package.description,
      fields:[{
        name:'About :',
        value:`‣ **Version :** ${r.package.version
          }\n‣ **Last Publish :** <t:${Math.floor(+new Date(r.package.date)/1000)
          }:R>${author}${publisher}${maintainers}${keywords}`
      }],
      timestamp:new Date()
    }
  })
  return resp;
}

/*
const info='https://registry.npmjs.org/';
export async function npmInfo(name:string){
  let resp :typeNpm = await fetch(info+name)
    .then(_=>_.json());
  return [{
    author:{
      name:'npm',
      iconURL:'https://static.npmjs.com/f1786e9b7cba9753ca7b9c40e8b98f67.png'
    },
    title : resp.name,
    description : resp.description,
    color:'#fa4704',
    filelds : [{
      name : 'About :',
      value:`version : ${resp["dist-tags"].latest}\n`
    }]
  }]
}

interface typeNpm {
  time : { string : string };
  name : string;
  "dist-tags" : { latest : string } ;
  versions: {
    string : {
      name : string,
      version : string ,
      main: string,
      author : {
        name : string,
      },
      dependencies : {string : string},
    }
  }
  maintainers : {
    name : string,
    email ?: string
  }[];
  description : string;
  homepage : string;
  keywords : string[];
  repository : { 
    type : string,
    url : string,
    
  }
  author : { name : string };
}*/