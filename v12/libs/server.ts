import http from 'http';
const port = process.env.PORT || 3000;
const text = `An Open Source Discord bot!

Github : https://github.com/RajnishAnand/discord-bot-glitchi
Glitchi Support server : https://discord.gg/ZARyCT3a7G

Invite Bot : https://discord.com/oauth2/authorize?client_id=852227150455373906&scope=bot&permissions=4161666295
`;

http.createServer((req,res)=>{
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(text);
}).listen(port);

console.log('server started on PORT :',port)