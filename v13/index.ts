import validate from './validate';
import Client from "./client"

const client = new Client();

validate().then(()=>{
  client.init();
})



