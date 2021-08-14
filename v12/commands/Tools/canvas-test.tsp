import { createCanvas, loadImage } from 'skia-canvas';
import { argumentObjectType, message } from '../types';
//import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main(args)
  }
  async main(args:string[]){
  }
}

export default {
  name : 'cnv',
  description : 'null',
  // aliases : [string],
  // usage : string,
  // args : boolean,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}