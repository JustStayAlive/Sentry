module.exports = {
  command: {
    id: 'ping',
    trigger: ['ping', 'pong'],
    execute: async (client, content, author, guild, channel, message, prefix, trigger, arguments) => { // eslint-disable-line no-unused-vars
      let response = await channel.createMessage({
        embed: {
          color: 12335146,
          title: (trigger === 'ping') ? 'Pong!':'Ping!'
        }
      });

      response.edit({
        embed: {
          color: 12335146,
          title: response.embeds[0].title,
          fields: [
            {
              name: 'Latency',
              value: `${response.timestamp - message.timestamp}ms`,
              inline: true
            },
            {
              name: 'API Latency',
              value: `${client.requestHandler.latencyRef.latency}ms`,
              inline: true
            }
          ]
        }
      });
    }
  }
};
