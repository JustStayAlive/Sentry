const eris = require('eris');
const recursive = require('recursive-readdir');

module.exports = class Client extends eris.Client {
  constructor (token = '', options = {}) {
    super(token, options.eris);
  }

  discover (directory) {
    return new Promise((resolve, reject) => {
      recursive(directory).then((files) => {
        let fileList = [];

        for (let i = 0; i < files.length; i++) {
          if (!(files[i].includes('node_modules') || files[i].includes('index.js') || files[i].includes('package.json'))) {
            fileList.push(files[i]);
          }
        }

        return resolve(fileList);
      }).catch(err => {
        return reject(err);
      });
    });
  }
};
