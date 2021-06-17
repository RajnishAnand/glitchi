module.exports = {
  name : 'ready',
  once : true,
  execute({client}){
    console.log('ready!');
    client.user.setActivity(`${prefix}commands`, { type: "LISTENING"}); 
  }
}