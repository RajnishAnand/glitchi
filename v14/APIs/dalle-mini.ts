import fetch from 'node-fetch';
export default async function dallemini(prompt: string) {
  return await fetch('https://bf.dallemini.ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
    .then((r) => r.json())
    .then((r: { images: string[] }) => {
      return r.images.map((i) => Buffer.from(i, 'base64'));
    });
}
