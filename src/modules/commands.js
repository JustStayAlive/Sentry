let client = require('../');

module.exports = {
  event: {
    id: 'commandsMessageCreate',
    event: 'messageCreate',
    type: 'on',
    execute: async (message) => {
      if (message.author.id === client.user.id || message.author.bot || !message.content) return;
      let prefix = new RegExp(`^(${client.commandManager.prefix.join('|')})(\\w+)(.*)`, 'i');
      if (!prefix.test(message.content)) return;

      let match = message.content.match(prefix), trigger = match[2].toLowerCase();
      let command = client.commands.find(command => (command.trigger.indexOf(trigger) > -1));
      if (!command) return;

      if (command.permission.length > 0) {
        for (let i = 0; i < command.permission.length; i++) {
          switch (command.permission[i]) {
            case 'developer': if (client.config.developers.indexOf(message.author.id) === -1) return; break;
            default: if (!message.channel.permissionsOf(message.author.id).has(command.permission[i])) return; break;
          }
        }
      }

      message.content = message.content.replace(match[1], '').replace(match[2], '').trim();
      command.execute(client, message.content, message.author, message.channel.guild ? message.channel.guild:message.author, message.channel, message, match[1], trigger, message.content.split(' '));
    }
  }
};
