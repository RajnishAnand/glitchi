import conf from '../../config';
module.exports = {
  name : 'invite',
  description : 'invite glitchi to your server!',
  execute({msg}:any){
    msg.channel.send('https://discord.gg/EuShUmJrZR',{embed:{
      color : '#00bfff',
      author : conf.info,
      description : '> Invite Glitch to your Server! you can join Glitchi Support Server for testing.\n 💌 |**Invite to your Server : [INVITE](https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot&permissions=4161666295)**',
      image : {
        url : 'https://i.ibb.co/3m498GL/IMG-20210628-211732.png',
      },
      timestamp : new Date(),
      
    }})
  }
}