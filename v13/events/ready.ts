import Client from '../client';
import { Event } from '../Interfaces';


export const event : Event = {
  name : 'ready',
  once: true,
  execute(client:Client){
    delete process.env.TOKEN;
    delete process.env.FIRE;
    if(! client.user)
      return new Error('User not found in Client!');
    console.log('Logged in as '+client.user.tag);
  }
}

