const Client = require('./core').Client;
const config = require('./config.json');

let client = new Client(config.token, {
  eventManager: config.eventManager
});

client.connect();

client.once('ready', () => {
  console.log(`${client.user.username}#${client.user.discriminator} is ready.`);
  console.log(`Invite URL is https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`); // This will only work for newer bots.
});

client.on('eventLoad', (event) => {
  console.log(`Loaded event ${event.id}.`);
});

client.on('eventFail', (err, path) => {
  console.log(`Failed to load an event at ${path}`);
  console.log(err.stack);
});

module.exports = client;
