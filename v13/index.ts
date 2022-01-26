import validate from './validate';
import Client from "./client"

// import eventHandler from '#libs/event-handler.js';
const client = new Client();

validate().then(()=>{
  client.init();
})



