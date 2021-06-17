const fetch = require('node-fetch');
module.exports = {
  name: 'chat',
  description: 'Chat with another bot',
  args: true,
  execute({msg, args}) {
    let url = `https://api.udit.gq/api/chatbot?message=${args.join(' ')}&name=${msg.author.username}&user=${msg.author.id}`;
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => msg.channel.send(data.message));

    } catch (err) {
      //console.error(err);
      msg.channel.send(`${err.message}`);
    }
  },
};
