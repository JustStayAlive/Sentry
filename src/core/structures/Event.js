module.exports = class Event {
  constructor (event = {}) {
    if (!event.id) throw new Error('Event requires an ID');
    else if (!event.event) throw new Error('Event requres a name');
    else if (!event.type) throw new Error('Event requires a type');
    else if (!event.execute) throw new Error('Event requires an execute function');

    this.id = event.id;
    this.event = event.event;
    this.type = event.type;
    this.execute = event.execute;
  }
};
