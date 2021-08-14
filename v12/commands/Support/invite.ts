import { argumentObjectType, message } from '../types';
//import pageView from '../../libs/pagination/index';

class run{
  declare msg: message;
  constructor ({msg,args}: argumentObjectType){
    this.msg = msg;
    this.main()
  }
  async main(){
    this.msg.channel.send({embed:{
      color : '#00bfff',
      author : {
        name: "Glitchi",
        icon_url: "https://cdn.discordapp.com/avatars/852227150455373906/2f06054bcc4e7cea81c975f97849eb91.png"
      },
      description : '> Invite Glitch to your Server! you can join Glitchi Support Server for testing.\n 💌 |**Links : [[INVITE]](https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot&permissions=4161666295) | [[JOIN SUPPORT SERVER]](https://discord.gg/EuShUmJrZR)**',
      image : {
        url : 'https://i.ibb.co/3m498GL/IMG-20210628-211732.png',
      },
      timestamp : new Date(),
      
    }})
  }
}

export default {
  name : 'invite',
  description : 'invite glitchi to your server!',
  // aliases : [string],
  // usage : string,
  args : false,
  // permissions : string,
  // devOnly : boolean,
  // permRequired : [string],
  run
}

    // msg.channel.send('https://discord.gg/EuShUmJrZR',{embed:{
    //   color : '#00bfff',
    //   author : conf.info,
    //   description : '> Invite Glitch to your Server! you can join Glitchi Support Server for testing.\n 💌 |**Invite to your Server : [INVITE](https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot&permissions=4161666295)**',
    //   image : {
    //     url : 'https://i.ibb.co/3m498GL/IMG-20210628-211732.png',
    //   },
    //   timestamp : new Date(),
      
    // }})