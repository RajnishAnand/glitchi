const wordReplace = [
  ['winner', 'winher'],
  ['i would', 'id'],
  ['you would', 'ud'],
  ['i am', 'im'],

  ['wifi', 'wify'],
  ['girl', 'gril'],
  ['girls', 'grils'],
  ['simp', 'shrimp'],
  ['people', 'ppl'],
  ['peoples', 'ppls'],
  ['right now', 'rn'],
  // ["angry", "angri"],
  // ["college", "cllg"],
  // ["colleges", "cllgs"],
  ['and', 'n'],
  ['freedom', 'phreedam'],
  // ["speech", "spitch"],
  ['whose', 'whos'],
  ['though', 'dho'],
  ['constitution', 'constntn'],
  // ["same", "sem"],
  ['insane', 'sane'],
  ['okey', 'aokay'],
  ['something', 'smthg'],
  ["didn't", 'didtn'],
  ['right', 'ryt'],
  ['bro', 'vro'],
  ['language', 'lang'],
  // ["pressure", "prssure"],
  ['google', 'giogle'],
  ['you', 'u'],
  // ["stock", "stocke"],
  ['not', 'note'],
  ['different', 'dffrt'],
  // ["involved", "invlvd"],
  ['the', 'da'],
  ['forgot', 'forgor'],
  ['sad', 'sed'],
  ['comments', 'cmmts'],
  ['already', 'alreadg'],
  ['many', 'mang'],
  ['peace', 'piecse'],
  ['knows', 'knws'],
  // ["shock","shok"],
  ['something', 'smthg'],
  // ["the","da"],
  ['probably', 'prolly'],
];

const nsfwFilter = [
  ['fucking', 'flucking'],
  ['shit', 'shytt'],
  ['hitler', 'h!tler'],
  ['racist', 'raxcist'],
  ['politics', 'politex'],
  ['scam', 'scem'],
  ['bitch', 'beech'],
];

const okReplace = [
  ['tion', 'shan'],
  ['ner', 'nher'],
  ['ked', 'qed'],
  ['ck', 'k'],
  ['vol', 'vl'],
  ['ved', 'vd'],
  ['pre', 'pr'],
  ['ry', 'ri'],
  ['ame', 'em'],
  ['ch', 'tch'],
  ['ee', 'i'],
  ['lleg', 'llg'],
  ['the', 'da'],
  ['dy', 'di'],
];

export function toBeegoLang(txt: string) {
  // punctuations
  txt = txt.replaceAll(/ ?, ?/g, ' ').replaceAll('.', '');

  txt = txt.toLowerCase();

  // words
  wordReplace.forEach((e) => {
    txt = txt.replaceAll(new RegExp(`(^${e[0]})|((?= )${e[0]})`, 'gm'), e[1]);
  });

  // pronounciation
  okReplace.forEach((e) => {
    txt = txt.replaceAll(new RegExp(`(?! )${e[0]}`, 'gm'), e[1]);
  });

  // non safe words
  nsfwFilter.forEach((e) => {
    txt = txt.replaceAll(e[0], e[1]);
  });

  return txt;
}

const text = `Welcome to SoloLearn Chat,
Read the rules,
maybe introduce yourself in introduction. 
If you're good at a programming language, 
go to roles to set yourself a language role.
If no-one is around, 
there are plenty of channels to explore.
I hope you enjoy your stay!`;

console.log(toBeegoLang(text));
