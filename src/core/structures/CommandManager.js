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

  load (path, id) {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(path)];
        let module = require(require.resolve(path));

        if (!module.command) return reject(new Error(`Couldn't find a command in ${path}`));
        let command = new Command(module.command);
        if (command.id !== id) return reject(new Error(`Couldn't find the command in ${path}`));
        command.path = path;

        this.commands.set(command.id, command);
        this.client.emit('commandLoad', command);
        return resolve(command);
      } catch (err) {
        return reject(err);
      }
    });
  }

  unload (id) {
    return new Promise((resolve, reject) => {
      if (!this.commands.has(id)) return reject(new Error('Command doesn\'t exist'));
      let command = this.commands.get(id);
      this.commands.remove(command);
      this.client.emit('commandUnload', command);
      return resolve();
    });
  }

  reload (id) {
    return new Promise((resolve, reject) => {
      if (!this.commands.has(id)) return reject(new Error('Command doesn\'t exist'));
      let command = this.commands.get(id);
      this.commands.remove(command);
      this.load(command.path, command.id).then(command => resolve(command)).catch(err => reject(err));
    });
  }
};
