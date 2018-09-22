let Event = require('./Event');

module.exports = class EventManager {
  constructor (client, options = {}) {
    if (!client) throw new Error('EventManager requires the client');
    this.client = client;
    this.events = new client.Collection(Event);

    if (options.directories && options.directories.length > 0) {
      for (let i = 0; i < options.directories.length; i++) {
        client.discover(options.directories[i]).then(paths => {
          for (let i = 0; i < paths.length; i++) {
            try {
              let module = require(require.resolve(paths[i]));

              if (module.event) {
                if (!module.event.id) throw new Error();
                module.event.path = paths[i];

                this.events.set(module.event.id, module.event);
                if (module.event.type === 'on') this.client.on(module.event.id, module.event.execute);
                else if (module.event.type === 'once') this.client.once(module.event.id, module.event.execute);
                client.emit('eventLoad', module.event);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }).catch(err => console.log(err));
      }
    }
  }
};
