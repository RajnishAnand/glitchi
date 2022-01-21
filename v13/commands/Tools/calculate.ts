import {inspect} from 'util';
import {compile} from 'mathjs';
import {Command} from 'Interfaces';
import {pageView} from '../../libs'


export const command: Command = {
  name : 'calculate',
  aliases : ['calc'],
  description : 'a calculator',
  usage : '<...text>',
  args : true,

  async run({msg,content}){
    try{
      const txt = compile(content()).evaluate();
      new pageView(msg,inspect(txt,{depth:10}),{
        code: 'js',
        title: 'MATH.JS'
      });
    }
    catch(err: any){
      new pageView(msg,err.message??' ',{
        code: 'js',
        title: 'MATH.JS[ERROR]',
      });
    }
  }
}

