import { argumentObjectType } from '../types';
import cp from 'child_process';
import util from 'util';
import pageView from '../../libs/pagination/index';

function run({msg,content}:argumentObjectType){
  if(!msg.author.id===global.config.ownerID)return;
    cp.exec (content(),(...d)=>{
      let tx = d[0]?util.inspect(d[0]):d[1]?d[1]:d[2];
      new pageView(msg,tx,{code:'bash'})
  }) 
}

export default {
  name : 'exec',
  description : 'execute command directly to bash',
  aliases : ['ex'],
  // usage : string,
  args : true,
  // permissions : string,
  devOnly : true,
  // permRequired : [string],
  // examples : [string],
  run
}