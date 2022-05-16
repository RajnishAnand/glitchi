import {inspect} from 'util';
import {compile} from 'mathjs';
import {Command} from 'Interfaces';
import {pageView, Stopwatch} from '#libs'


export const command: Command = {
  name : 'calculate',
  aliases : ['calc'],
  description : 'a calculator',
  usage : '<...text>',
  args : true,

  async run({msg,content}){
    const stopwatch = new Stopwatch();

    try{
      stopwatch.start()
      const txt = compile(content()).evaluate();
      stopwatch.stop()

      new pageView(msg,inspect(txt,{depth:10}),{
        code: 'js',
        title: 'MATH.JS',
        secondaryTitle : `⏱ ${stopwatch.elapsed}s`
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

