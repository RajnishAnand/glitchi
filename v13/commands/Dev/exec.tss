import { argumentObjectType, message } from '../types';
import cp from 'child_process';
import util from 'util';
import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,content}: argumentObjectType){
    this.msg = msg;
    this.main(content)
  }
  async main(content:string){
    if(!this.msg.author.id===global.config.ownerID)return;
    cp.exec (content,(...d)=>{
      let tx = d[0]?util.inspect(d[0]):d[1]?d[1]:d[2];
      pageView(this.msg,{text:tx,code:'js'})
    }) 
  }
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