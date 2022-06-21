import { MessageEmbed } from 'discord.js';

const url = 'https://rockyou.arnavkr.repl.co/';

/** if password is in the list returns rocked */
export async function rockYou(pass: string) {
  pass = encodeURI(pass);

  const resp: rockYouResponse = await fetch(`${url}?password=${pass}`)
    .then((r) => r.json())
    .catch((e) => e);
  return embedify(resp);
}

/** embedifies the rockYou response */
function embedify(data: rockYouResponse) {
  if (!('password' in data)) {
    return new MessageEmbed({
      title: 'PassCheck[ERROR]',
      description: `\`\`\`js\n{\n  code: ${data.code}\n  message: "${
        'data' in data ? data.data : data?.message
      }"\n} \`\`\``,
    });
  }
  return new MessageEmbed({
    title: 'PassCheck',
    color: data.rocked ? 'RED' : 'GREEN',
    image: {
      url: data.rocked
        ? 'https://c.tenor.com/bzVhf9TfRhoAAAAM/throw-rock.gif'
        : '',
    },
    description: `__Password:__ \`${data.password}\`\n└╼ is ${
      data.rocked ? '' : 'not'
    } on the dictionary attack list.\n> ${data.data}`,
  });
}

type rockYouResponse =
  | {
      code: 200;
      data: string;
      password: string;
      rocked: boolean;
      status: 'success';
    }
  | {
      code: 400;
      data: string;
      status: 'error';
    }
  | {
      code?: number;
      message?: string;
    };
