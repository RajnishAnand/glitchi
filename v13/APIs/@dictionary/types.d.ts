type dictionaryapiResponse = {
  word: string;
  phonetic: string;

  phonetics: {
    text: string;
    audio ?: URL;
    sourceUrl ?: URL;
    license ?: { name: name, url: URL};
  }[];

  meanings: {
    partOfSpeech: string; 
    synonyms: string[]|[];
    antonyms: string[]|[];

    definitions: {
      definition: string;
      synonyms: string[]|[];
      antonyms: string[]|[];
      example ?: string;
    }[];

  }[];

  license: { name: string, url: URL };
  sourceUrls: URL[],
}[];
