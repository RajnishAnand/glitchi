import { argumentObjectType, message } from '../types';
import pageView from '../../libs/pagination/index';
import fetch from 'node-fetch';

class run{
  declare msg: message;
  constructor ({msg,content,commandName}: argumentObjectType){
    this.msg = msg;
    this.main(content,commandName)
  }
  async main(content:string,commandName:string){
    
    const url = (commandName=='mdn')?'https://developer.mozilla.org/api/v1/search?q=':'https://api.npms.io/v2/search?q=';
    try{
    let resp = await fetch(url+encodeURI(content))
      .then(r=>r.json());
    if(commandName!='node'){
      if(!resp.documents.length)return this.send();
      resp = resp.documents.map((r:{mdn_url:string,summary:string,title:string})=>{return {
        author:{
          name : 'MDN Web Docs',
          iconURL:'https://developer.mozilla.org/favicon-48x48.97046865.png',
        },
        title:r.title,
        url:'https://developer.mozilla.org/'+r.mdn_url,
        color:'#000000',
        description:r.summary,
        timestamp:new Date()
      }})
      pageView(this.msg,resp);
    }
    
    
    }catch(err){this.send('Unknown error Occured!')}
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
  // devOnly : boolean,
  // permRequired : [string],
  examples : ['AJAX','fetch'],
  run
}