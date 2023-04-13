export type dictionaryapiResponse =
  | {
      word: string;
      phonetic: string;

      phonetics: {
        text: string;
        audio?: string;
        sourceUrl?: string;
        license?: { name: name; url: string };
      }[];

      meanings: {
        partOfSpeech: string;
        synonyms: string[] | [];
        antonyms: string[] | [];

        definitions: {
          definition: string;
          synonyms: string[] | [];
          antonyms: string[] | [];
          example?: string;
        }[];
      }[];

      license: { name: string; url: string };
      sourceUrls: string[];
    }[]
  | notFoundDictionaryApiResponse;

type notFoundDictionaryApiResponse = {
  title: string;
  message: string;
  resolution: string;
};
