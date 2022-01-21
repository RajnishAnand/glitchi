import {Command} from 'Interfaces';

export const command :Command = {
  name : 'invite',
  description : 'invite glitchi to your server!',
  args : false,

  run({msg}){
    msg.channel.send({
      embeds:[{
        color : '#00bfff',
        author : {
          name: "Glitchi",
          icon_url: "https://cdn.discordapp.com/avatars/852227150455373906/2f06054bcc4e7cea81c975f97849eb91.png"
        },
        description : '> Invite Glitch to your Server! you can join Glitchi Support Server for testing 💌. ',
        image : {
          url : 'https://media.discordapp.net/attachments/906985861525155880/934092437473886288/2022-01-21-19-45-37.jpg',
        },
        timestamp : new Date(),
      }],
      components : [
        {
        type : 'ACTION_ROW',
        components : [
          {
            type : 'BUTTON',
            label: 'Invite',
            style: 'LINK',
            url: 'https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot%20applications.commands&permissions=413927861313'
          },
          {
            type: 'BUTTON',
            style: 'LINK',
            label: 'Join Support Server',
            url: 'https://discord.gg/EuShUmJrZR'
          }
        ]
      }]
    })
  }
}

