import pageView from '../../libs/pagination/';
module.exports = {
  name: 'embed',
  description: 'convert your json-code to Embed',
  args: true,
  execute({ msg,args}:any) {
    let txt = args.join(' ').replace(/​/g,'');
    if(txt.slice(0,7)==='```json' && txt.substr(-3)==='```'){
      let json = args.join(' ').slice(7,-3);
      try{
        let obj = JSON.parse(json);
        if(Array.isArray(obj))pageView(msg,obj);
        else pageView(msg,[obj]);
      }
      catch(err){
        pageView(msg,err.message);
      }
      return;
    }
    let m0= msg.channel.send('Your message is far beyond my pasing limit. Try sending it in a **"json code-block"**')
  }
}