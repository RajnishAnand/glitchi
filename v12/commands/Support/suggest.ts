  // clones : {
  //   'suggest':{
  //     name : 'suggest',
  //     description:'Send Suggestions',
  //     examples : ['add this cool command'],
  //     usage : '[,suggestions]',
  //     args : true,
  //     run
  //   },
  // }


import fd from './feedback';

// class run{
//   declare msg: message;
//   constructor ({msg,args}: argumentObjectType){
//     this.msg = msg;
//     this.main(args)
//   }
//   async main(args:string[]){
//   }
// }

export default {
  name : 'suggest',
  description : 'send suggestions',
  // aliases : string,
  usage : '[...suggestions]',
  args : true,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  examples : ['this is a suggestion!'],
  run:fd.run
}