import cp from 'child_process';
import util from 'util';
import { stringPagination } from '#libs';
import {Command} from 'Interfaces';


export const command: Command = {
  name : 'exec',
  description : 'execute command directly to bash',
  aliases : ['ex'],
  // usage : string,
  args : true,
  // permissions : string,
  devOnly : true,
  // permRequired : [string],
  // examples : [string],
  run({msg, content}){
    if(!(msg.author.id===msg.client.config.ownerId))return;
      cp.exec (content(),(...d)=>{
        let tx = d[0]?util.inspect(d[0]):d[1]?d[1]:d[2];
        new stringPagination(msg,tx,{decoration: {lang:'bash',title:'BASH-OUTPUT'}})
    }) 
  }
}
