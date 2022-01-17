import fetch from 'node-fetch';
import {MessageEmbed} from 'discord.js';
import {User} from './types';

const url = process.env.API0+'/user/';

export default async function (id:number){
  let user : User = await fetch(url+id)
    .then(r=>r.json())
    .catch(()=>{throw new Error('Found an Unknown Error while getting user info!')});
      
  if(!user.getProfile)
    throw new Error('User not Found !');
  
  const badges = user.getProfile.userDetails.badges!=null?user.getProfile.userDetails.badges.map(b=>'`['+b.name+']`').join(' ')+'\n':'';
  
  const levelxp = '‣ level :'+user.getProfile.userDetails.level+'\n‣ xp : '+user.getProfile.userDetails.xp+'\n';
  
  const follow = '‣ Followers : '+user.getProfile.userDetails.followers+'\n‣ Following : '+user.getProfile.userDetails.following+'\n';
  
  const country = user.getProfile.userDetails.countryCode?'‣ Country : '+user.getProfile.userDetails.countryCode+' :flag_'+user.getProfile.userDetails.countryCode.toLocaleLowerCase()+':\n':'';
  
  const bio = user.getProfile.userDetails.bio?`‣ Bio : ${user.getProfile.userDetails.bio}\n`:'';

  const coursesCompleted ={
    name : `Courses Completed : \`[${user.getProfile.certificates.length}]\``,
    value : (user.getProfile.certificates.map(e=> '\n`  ‣` ['+e.name+']('+e.imageUrl+')').join('')+'\n').substr(0,1024),
    inline: true,
  }
  const coursesProgress = {
    name :`Courses Progress : \`[${user.getProfile.coursesProgress.length}]\``,
    value : user.getProfile.coursesProgress.map(e=>`\n \`‣\` ${e.courseName}\n   \`${("█".repeat(Math.ceil(e.progress*20))+"░".repeat(20)).substr(0,20)+`[${e.progress*100}%]`}\``) .join('').substr(0,1024),
    inline: true
  }
  
  return {
    overview : [
      new MessageEmbed({
       author:{
         name : 'Sololearn',
         icon_url:'https://media.discordapp.net/attachments/906985861525155880/906985890356793434/1a4d095737caeccfc65bcb30243f4b8f.png',
       },
       title : user.getProfile.userDetails.name,
       thumbnail : {
         url : user.getProfile.userDetails.avatarUrl
       },
       color:'#1f1e28',
       url : 'https://www.sololearn.com/Profile/'+user.getProfile.userDetails.id,
       description : badges+levelxp+follow+country+bio,
       fields : [ coursesCompleted,coursesProgress ]
      }),
    ]
  };
}

