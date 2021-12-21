import config from '../config.json';

declare global {
  namespace NodeJS {
    interface Global {
       config
    } 
  }
}

export default global;