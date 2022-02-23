//////////////////////////////////////////////////////////
// Only In case a HTTPServer is required to keep online //
//////////////////////////////////////////////////////////

const http = require('http');
const port = process.env.PORT || 3000;
const text = `running!`;

http.createServer((_,res)=>{
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(text);
}).listen(port);

console.log('server started on PORT :',port)
