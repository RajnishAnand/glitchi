import { argumentObjectType, message } from '../types';
import fetch from 'node-fetch';
import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  async main(args:string[]){
    this.fetchit(args[0]).then((d:string)=>{
      pageView(this.msg,d);
    })
  }
  
  async fetchit(link:string){
    let txt = await fetch(link).then(r => r.text())
      .catch((err:Error) => err.message);
    return txt;
  }
}

export default {
  name : 'fetch',
  description : 'To fetch any URL .',
  usage : '[url]',
  args : true ,
  // aliases : [string],
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}


// module.exports = {
//   execute({msg,args}:any){
//     fetchit(
//       args[0],
//       (data:string)=>{msg.channel.send({embed : {
//         'color' : '#00bfff',
//         'title':'Fetched document : ',
//         'description' : '```html\n'+data.substr(0,500)+'```',
//         'fields' : [
//           {
//             'name' : 'Full document :',
//             'value': `https://cors-fetch-it.herokuapp.com/${args[0]}`
//           },
//         ],
//         'timestamp':new Date(),
//         if ='footer': conf.info,
//         }})},
//         (err:any)=>{msg.channel.send({embed:{
//           'color': '#00bfff',
//           'title':'Failed to fetch :',
//           'description':`\`${err.message}\``,
//           'timestamp':new Date(),
//           'footer':conf.info,
//         }})}
//     );
//   }
// };

//To  fetch and callback
