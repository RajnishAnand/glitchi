import fetch from 'node-fetch';
import {MessageEmbed} from 'discord.js';
// import {User} from './user';

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
  
  const bio = user.getProfile.userDetails.bio?`‣ Bio : ${user.getProfile.userDetails.bio}`:'';
  
  return [ 
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
      description : badges+levelxp+follow+country+bio
    }),
  ];
}


interface User {
  getProfile : false | {
    userDetails : {
      id : number,
      name : string,
      avatarUrl : string,
      badges : {
        name : string,
        priority : number
      }[] | null,
      level : number,
      xp : number,
      countryCode : string ,
      isPro : boolean,
      followers : number,
      following : number,
      bio : null | string,
      connectedAccounts : {
        connectionId: number,
        service: string,
        name: string,
        profileUrl: string,
        isVisible: true,
        syncDate: null,
        avatarUrl: string,
      }[]|[],
    },
    
    coursesProgress: {
      courseId: number,
      courseName: string,
      courseIconURL: string,
      courseColor: string,
      isCompleted: boolean,
      lastProgressDate: Date,
      progress: number
    }[]|[],
    
    certificates: {
      courseId: number,
      name: string,
      courseColor: string,
      iconURL: string,
      startDate: Date,
      expireDate: null,
      url: string,
      imageUrl: string,
      uncompleteUrl: string
    }[]|[],
    
    userGoals: null,
    userStreak: null,
    codeCoaches: null,
    userBadges: {
      nextChallange: null,
      badges: {
        id: number,
        title: null|string,
        description: null|string,
        iconURL: string,
        color: string,
        isUnlocked: boolean,
        unlockDate: Date
      }[]|[],
    },
    
    userCodes: {
      id: number,
      publicId: string,
      language: string,
      name: string,
      isPublic: boolean,
      modifiedDate: Date
    }[]|[],
    
    userGoalProgress ?: {
      id: number,
      userGoalId: number,
      currentValue: number,
      targetValue: number,
      localDate: Date,
      date: Date
    }[],
    
    userLessonGoals ?: {
      id: number,
      userId: number,
      goalType: number,
      goalValue: number,
      origin: number,
      localDate: Date,
      date: Date
    }[],
    
    userDailyStreak: null|number
  }
} 

