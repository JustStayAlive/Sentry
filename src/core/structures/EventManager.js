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
                let event = new Event(module.event);
                event.path = paths[i];

                this.events.set(event.id, event);
                if (event.type === 'on') this.client.on(event.event, event.execute);
                else if (event.type === 'once') this.client.once(event.event, event.execute);
                client.emit('eventLoad', event);
              }
            } catch (err) {
              client.emit('eventFail', err, paths[i]);
            }
          }
        }).catch(err => console.log(err));
      }
    }
  }
};
