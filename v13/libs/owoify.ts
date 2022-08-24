const dict: { [index: string]: string } = {
  l: 'w',
  r: 'w',
  n: 'ny',
  v: 'b',

  // common nsfw word filters
  shit: 'shoot',
  fuck: 'fucky',
  fuk: 'fucky',
  friend: 'fwend',
};

const emotes = [
  'OwO',
  'UwU',
  'owo',
  'uwu',
  '〜(꒪꒳꒪)〜',
  '(ㆁωㆁ)',
  '(◡ ω ◡)',
  '<(￣︶￣)>',
  '(｡•̀ᴗ-)✧',
  "(•^'^•)",
];

export function owoify(txt: string) {
  const randE = emotes[Math.floor(Math.random() * emotes.length)];

  txt = txt.toLowerCase().replace(/@((here|everyone))/g, (match) => {
    return match.substring(1);
  });

  const reg = new RegExp(Object.keys(dict).join('|'), 'gi');
  txt = txt.replace(reg, (match) => {
    return dict[match];
  });

  return txt + ' ' + randE;
}
