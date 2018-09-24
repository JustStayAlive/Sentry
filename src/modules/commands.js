let client = require('../');

module.exports = {
  event: {
    id: 'commandsMessageCreate',
    event: 'messageCreate',
    type: 'on',
    execute: async (message) => { // eslint-disable-line no-unused-vars
      if (message.author.id === client.user.id || message.author.bot || !message.content) return;
      let prefix = new RegExp(`^(${client.commandManager.prefix.join('|')})(\\w+)(.*)`, 'i');
      if (!prefix.test(message.content)) return;

      let match = message.content.match(prefix), trigger = match[2].toLowerCase();
      let command = client.commands.find(command => (command.trigger.indexOf(trigger) > -1));
      if (!command) return;

      message.content = message.content.replace(match[1], '').replace(match[2], '').trim();
      command.execute(client, message.content, message.author, message.channel.guild ? message.channel.guild:message.author, message.channel, message, match[1], trigger, message.content.split(' '));
    }
  }
};
