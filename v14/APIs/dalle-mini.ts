import fetch from 'node-fetch';
export default async function dallemini(prompt: string) {
  return await fetch('https://bf.dallemini.ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
    .then((r) => r.json() as Promise<dalleResponse>)
    .then((r) => {
      return r.images.map((i) => 'data:image/png;base64,' + i);
    });
}

type dalleResponse = {
  images: string[];
  version: string;
};
