import fetch from 'node-fetch';
const URL = 'https://godbolt.org/api/format/';

export default async function (
  format: (typeof formats)[number],
  options: options<typeof format>,
) {
  const response = await fetch(URL + format, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  }).then((r) => r.json() as Promise<{ answer: string; exit: number }>);
  return response.answer;
}

export const formats = [
  'clangformat',
  'rustfmt',
  'gofmt',
  'dartformat',
] as const;
export const clangStyles = [
  'Google',
  'LLVM',
  'Mozilla',
  'Chromium',
  'WebKit',
  'Microsoft',
  'GNU',
] as const;

interface options<lang extends (typeof formats)[number]> {
  source: string;
  base: lang extends 'clangformat' ? (typeof clangStyles)[number] : never;
  useSpaces: boolean;
  tabWidth: number;
}
