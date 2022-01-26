export interface User {
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
      bio : string,
      registerDate: string,
      connectedAccounts : {
        connectionId: number,
        service: string,
        name: string,
        profileUrl: string|null,
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
      language: "web"|"cpp"|"c"|"cs"|"java"|"kt"|"swift"|"py"|"rb"|"php"|"node"|"go",
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
