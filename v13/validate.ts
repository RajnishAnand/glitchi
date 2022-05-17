const requiredEnv = [
  "TOKEN",      // DISCORD BOT TOKEN
  'ACOKEY',     // ACOBOT CHAT API KEY
  'UNSPLASH'    // FOR IMAGE 
  
  //? 'HTTPSERVER', 'BETA' ,'PROTECTED' ?//
]

if (!process.env[requiredEnv[0]])
   try { require('dotenv').config() } catch {};

 export default async function validate() {
  console.log('validating required TOKENs...');
  let hasKey = true;

  for (let key of requiredEnv)
    if (!(key in process.env)) {
      console.log(`'${key}' not Found!`);
      hasKey = false;
    };

  if (!hasKey) {
    console.log('\nPlease declare these Environment Variables in .env file at the root of your directory or in SECRET');
    process.exit(0);
  }
  console.log('Success !');
  // config.prefix = config.prefix[+config.beta];

  if (+(process.env.HTTPSERVER??0)) require('../server.js');
  process.on('unhandledRejection', console.log);
  process.on('uncaughtException',console.log);
}
