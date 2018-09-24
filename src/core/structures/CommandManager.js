let Command = require('./Command');

module.exports = class CommandManager {
  constructor (client, options = {}) {
    if (!client) throw new Error('CommandManager requires the client');
    this.client = client;
    this.commands = new client.Collection(Command);
    this.prefix = options.prefix;

    if (options.directories && options.directories.length > 0) {
      for (let i = 0; i < options.directories.length; i++) {
        client.discover(options.directories[i]).then(paths => {
          for (let i = 0; i < paths.length; i++) {
            try {
              let module = require(require.resolve(paths[i]));

              if (module.command) {
                let command = new Command(module.command);
                command.path = paths[i];

                this.commands.set(command.id, command);
                client.emit('commandLoad', command);
              }
            } catch (err) {
              client.emit('commandFail', err, paths[i]);
            }
          }
        }).catch(err => console.log(err));
      }
    }
  }
};
