module.exports = {
  name : 'bulk-delete',
  discription : 'bulk message delete',
  args : true,
  devOnly : true,
  execute(msg,args){
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