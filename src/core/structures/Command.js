module.exports = class Command {
  constructor (command = {}) {
    if (!command.id) throw new Error('Command requires an ID');
    else if (!command.trigger) throw new Error('Command requires a trigger');
    else if (!command.execute) throw new Error('Command requires an execute function');

    this.id = command.id;
    this.trigger = command.trigger;
    this.execute = command.execute;

    this.permission = command.permission || [];
  }
};
