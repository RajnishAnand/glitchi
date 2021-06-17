module.exports = {
  name : 'bulk-delete',
  description : 'bulk message delete',
  args : true,
  permissions : 'MANAGE_MESSAGES',
  execute({msg,args}){
    let amount = parseInt(args[0])
    if(!isNaN(amount)){
      msg.channel.bulkDelete(amount,true)
        .catch(err=>msg.channel.send(err.message));
    }
    else{
      masg.channel.send(`Unable to resolve ${args[0]} as Integer!`);
    };
  }
};