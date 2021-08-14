import { argumentObjectType, message } from '../types';
import {inspect} from 'util';
import {compile} from 'mathjs';
import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,content}: argumentObjectType){
    this.msg = msg;
    this.main(content)
  }
  async main(content : string){
    try{
      const txt = compile(content).evaluate();
      pageView(this.msg,inspect(txt));
    }
    catch(err){
      pageView(this.msg,err.message);
    }
  }
}

export default {
  name : 'calculate',
  aliases : ['calc'],
  description : 'a calculator',
  usage : '[text]',
  args : true,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}


// module.exports = {
  
//   execute({msg,content}:any){
//     try{
//       const txt = compile(content).evaluate();
//       pageView(msg,inspect(txt));
//     }
//     catch(err){
//       pageView(msg,err.message);
//     }
//   }
// }