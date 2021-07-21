require('dotenv').config();
if(process.env.TOKEN){
  require('../build/index.js');
}
else{
  console.log('Please add your TOKEN=<yourToken> in .env file at the root directory');
}