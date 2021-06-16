const fetch = require('node-fetch');
module.exports = {
  name: 'chatg',
  description: 'Chat with another bot',
  args: true,
  execute({msg, args}) {
    if (message.channel.id !== '853117760975142922') {
      return;
    }
    let url = `https://api.udit.gq/api/chatbot?message=${args.join(' ')}&nameGlitchi&user=852560696482463744&gender=female`;
    try {
      setTimeout(() => {
        fetch(url)
          .then(response => response.json())
          .then(data => message.channel.send(`A.chata ${data.message}`));

      }, 3000);

    } catch (err) {
      console.error(err);
      message.channel.send(`${err}`);
    }
  },
};
