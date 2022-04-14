import admin from 'firebase-admin';

const credential = JSON.parse(process.env.FIRE as string);
admin.initializeApp({
  credential : admin.credential.cert(credential),
  databaseURL: 'https://glitchi-1637429469337-default-rtdb.firebaseio.com/',
  databaseAuthVariableOverride : {
    uid : 'AdminAdmin'
  }
});

const db = admin.database();

const users = db.ref("users/");

console.log('Firebase initialized');
export default users;
