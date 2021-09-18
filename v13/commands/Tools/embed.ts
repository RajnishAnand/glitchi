import { argumentObjectType} from '../types';
import pageView from '../../libs/pagination';
import codeBlockParcer from '../../libs/codeBlock-parser';
import {Util} from 'discord.js';


export default {
  name: 'embed',
  description: 'convert your json-code to Embed',
  args: true,
  // aliases : [string],
  // usage : string,
  // permissions : string,
  // devOnly : boolean,
  run({msg,args}:argumentObjectType){
    let txt = args.join(' ')
      .replace(/[­ ]/g,'')
    txt = codeBlockParcer(txt).content??txt;
    try{
      let obj = JSON.parse(txt);
      if(Array.isArray(obj))new pageView(msg,obj);
      else new pageView(msg,[obj]);
    }
    catch(err){
      new pageView(msg,err.message,{code:'JSON_ERROR'});
    }
    
    //msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a  **"code-block"**');
  }
}

// /(\`\`\`)(?<code>\w+\s*)?\n(?<text>((?!\1).*\n*)+)\1/