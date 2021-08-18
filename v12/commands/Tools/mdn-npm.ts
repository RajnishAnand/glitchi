import { argumentObjectType, message } from '../types';
import pageView from '../../libs/pagination';
import fetch from 'node-fetch';

class run{
  declare msg: message;
  constructor ({msg,content,commandName}: argumentObjectType){
    this.msg = msg;
    this.main(content,commandName)
  }
  async main(content:string,commandName:string){
    
    const url = (commandName=='mdn')?'https://developer.mozilla.org/api/v1/search?q=':'https://registry.npmjs.org/-/v1/search?size=10&text=';
    try{
    let resp = await fetch(url+encodeURI(content))
      .then(r=>r.json());
    if(commandName!='npm'){
      if(!resp.documents.length)return this.send();
      resp = resp.documents.map((r:{mdn_url:string,summary:string,title:string})=>{return {
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
      pageView(this.msg,resp);
    }
    else{
      if(!resp.total)return this.send();
      resp = resp.objects.map((r:any)=>{return {
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
            }:R>\n‣ **Author :** ${r.package.author.username?`[${r.package.author.name}](https://www.npmjs.com/~${r.package.author.username})`:r.package.author.name
            }\n‣ **Publisher :** [${r.package.publisher.username}](https://www.npmjs.com/~${r.package.publisher.username
            })\n‣ **Maintainer(s) :** \n${r.package.maintainers.map((m:any)=>`    ⌙ [${m.username}](https://www.npmjs.com/~${m.username})`).join('\n')
            }${r.package.keywords?`\n>>> **Keywords :** ${r.package.keywords.join(', ')}`:''}`
        }],
        timestamp:new Date()
      }})
      pageView(this.msg,resp);
    }
    }catch(err){
      this.send('Unknown error Occured!')
      console.log(err);
    }
  }
  send(txt?:string){
    this.msg.channel.send(txt??global.config.emojis.sad+' Any relevant search result not found!');
  }
}

export default {
  name : 'mdn',
  description : 'search from mdn',
  // aliases : [string],
  usage : '[...query]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['AJAX','fetch'],
  run
}