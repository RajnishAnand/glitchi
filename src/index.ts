import validate from './validate';

// check for required Environmental variables
validate().then(async () => {
  const Client = await import('./client').then((e) => e.default);
  const client = new Client();
  client.init();
});
