import config from '../config.json';

declare global {
  namespace NodeJS {
    interface Global {
       config
    } 
  }
}
