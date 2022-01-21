import fetch from 'node-fetch';
import { MessageEmbed} from 'discord.js';
import {User} from './types';
import config from '../../client/config';

const url = process.env.API0+'/user/';

export default async function (id:number){
  let user : User = await fetch(url+id)
    .then(r=>r.json())
    .catch(()=>{throw new Error('Found an Unknown Error while getting user info!')});
      
  if(!user.getProfile)
    throw new Error('User not Found !');
  
  // Basic User Details
  const badges = user.getProfile.userDetails.badges!=null?user.getProfile.userDetails.badges.map(b=>'`['+b.name+']`').join(' ')+'\n':'';

  const levelxp = '‣ level :'+user.getProfile.userDetails.level+'\n‣ xp : '+user.getProfile.userDetails.xp+'\n';

  const follow = '‣ Followers : '+user.getProfile.userDetails.followers+'\n‣ Following : '+user.getProfile.userDetails.following+'\n';

  const country = user.getProfile.userDetails.countryCode?'‣ Country : '+user.getProfile.userDetails.countryCode+' :flag_'+user.getProfile.userDetails.countryCode.toLocaleLowerCase()+':\n':'';

  const registrationDate =`‣ Account Created : <t:${Math.round(+new Date(user.getProfile.userDetails.registerDate)/1000)}:D> \n`;

  const bio = user.getProfile.userDetails.bio?`‣ Bio : \n>>> ${user.getProfile.userDetails.bio}`:'';
  
  const connectedAccounts = user.getProfile.userDetails.connectedAccounts.map(a=>`${a.service} : ${a.profileUrl?`[${a.name}](${a.profileUrl})`: a.name } ${a.avatarUrl?`[[pfp]](${a.avatarUrl})`:''}`).join("\n");
  
  const coursesCompleted =user.getProfile.certificates.map(e=> '\n`  ‣` ['+e.name+']('+e.imageUrl+')').join('');

  const overview = [ 
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
      description : badges+levelxp+follow+country+registrationDate+bio,
      fields : (()=>{
        if(connectedAccounts.length){
          return [{
            name : "Connected Accounts :",
            value : connectedAccounts
          }]
        }
      })()
    }),
    new MessageEmbed({
      author : {
        name : "Sololearn",
        icon_url : 'https://media.discordapp.net/attachments/906985861525155880/906985890356793434/1a4d095737caeccfc65bcb30243f4b8f.png',
      },
      color : "#1f1e28",
      title : `${user.getProfile.userDetails.name}'s Certificates : [${user.getProfile.certificates.length}]`,
      description : coursesCompleted
    })
  ]


  
  // User's courses Progress⁶
  const courseProgress = user.getProfile.coursesProgress.map(e=>
    `\n­ ‣ ${e.courseName} :\n   \`${
      "█".repeat(Math.round(e.progress*25)).padEnd(25,'░')
    } [${(e.progress*100).toFixed(2)}%]\``);
  const maxCpLen= Math.ceil(courseProgress.length/8)
  const coursesProgress :MessageEmbed[] = [];
  for(let i =0;i<maxCpLen;i++){
    coursesProgress.push( new MessageEmbed( {
      author:{
        name : 'Sololearn',
        icon_url:'https://media.discordapp.net/attachments/906985861525155880/906985890356793434/1a4d095737caeccfc65bcb30243f4b8f.png', 
      },
      color: "#1f1e28", 
      title : `${user.getProfile.userDetails.name}'s Courses Progress`,
      description : courseProgress.slice( i*8,(i+1)*8 ).join('')
    }))
  }
  
  // user's codes 
  const codes = user.getProfile.userCodes.map(c =>`‣  ${config.emojis[c.language]??''} [${c.name}](https://code.sololearn.com/${c.publicId}) \n${(c.language=="web")?`    ⌙ [Open in Browser](https://code-sololearn.herokuapp.com/${c.publicId})\n`:''}    ⌙ Last Updated: <t:${Math.ceil(+new Date(c.modifiedDate)/1000)}:R>`);
  const codeslist : MessageEmbed[] = [];
  const codeLMax= Math.ceil(codes.length/8);
  for(let i = 0;i<codeLMax;i++){
    codeslist.push(new MessageEmbed({
      color : "#1f1e28",
      title : `${user.getProfile.userDetails.name}'s Codes: [${codes.length}]`,
      description : codes.slice(i*8,(i+1)*8).join("\n\n")
    }))
  }


  return {overview,coursesProgress,codeslist};
}

