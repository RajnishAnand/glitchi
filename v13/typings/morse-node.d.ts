declare module 'morse-node' {
  export function create(version: 'ITU') {
    return {
      encode(string) {
        return string;
      },
      decode(string) {
        return string;
      },
    };
  }
}
