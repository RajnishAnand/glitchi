import { argumentObjectType, message } from '../types';
// import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,content}: argumentObjectType){
    this.msg = msg;
    this.main(content)
  }
  main(content:string){
    this.msg.channel.send(content);
  }
}

export default{
  name : 'repeat',
  aliases : ['re'],
  description : 'Repeat',
  usage : '[text]',
  args : true,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}

// module.exports = {
//   name : 'repeat',
//   aliases : ['re'],
//   description : 'Repeat',
//   usage : '[text]',
//   args : true,
//   execute({msg,content}:any){
//     msg.channel.send(content);
//   }
// }