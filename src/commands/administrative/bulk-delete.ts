module.exports = {
  name : 'bulk-delete',
  description : 'bulk message delete',
  args : true,
  permissions : 'MANAGE_MESSAGES',
  execute({msg,args}:any){
    msg.react('856818054602948608');
    let amount = parseInt(args[0])
    if(!isNaN(amount)){
      let times = Math.floor(amount/100);
      let extra = amount - times*100;
      for(let i=0;i<times;i++){
        msg.channel.bulkDelete(100,true)
        .catch((err:any)=>msg.channel.send(err.message));
      }
      msg.channel.bulkDelete(extra,true)
        .catch((err:any)=>msg.channel.send(err.message));
    }
    else{
      msg.channel.send(`Unable to resolve ${args[0]} as Integer!`);
    };
  }
};