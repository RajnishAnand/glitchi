import mdnpm from './mdn-npm'

export default {
  name : 'npm',
  description : 'search for npm packages',
  // aliases : [string],
  usage : '[...query]',
  args : true,
  // permissions : string,
  // devOnly : true,
  // permRequired : [string],
  examples : ['react','discord.js'],
  run:mdnpm.run
}