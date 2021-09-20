export default function (str:string){
  const regex = /```(?:(\S+)\n)?\s?([^]+?)\s?```/;
  const match = str.match(regex);
  return {
    lang : match?.[1],
    code : match?.[2]
  }
}