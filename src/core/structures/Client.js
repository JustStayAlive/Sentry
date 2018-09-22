const eris = require('eris');

module.exports = class Client extends eris.Client {
  constructor (token = '', options = {}) {
    super(token, options.eris);
  }
};
