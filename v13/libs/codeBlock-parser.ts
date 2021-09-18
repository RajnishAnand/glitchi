export default function (str:string){
  const regex = /(\`\`\`)(\w+\s*)?\n(((?!\1).\n*)*)\1/m;
  const match = str.match(regex);
  return {
    code : match?.[2],
    content : match?.[3]
  }
}