import { argumentObjectType, message } from '../types';
import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  async main(args:string[]){
    let txt = args.join(' ')
      .replace(/[­ ]/g,'')
    if(txt.slice(0,7)=='```json' && txt.substr(-3)=='```'){
      let json = txt.slice(7,-3);
      try{
        let obj = JSON.parse(json);
        if(Array.isArray(obj))pageView(this.msg,obj);
        else pageView(this.msg,[obj]);
      }
      catch(err){
        pageView(this.msg,err.message);
      }
      return;
    }
    let m0= this.msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a **"json code-block"**')
  }
  
}

export default {
  name: 'embed',
  description: 'convert your json-code to Embed',
  args: true,
  // aliases : [string],
  // usage : string,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}