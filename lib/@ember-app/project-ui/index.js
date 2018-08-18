/* eslint-env node */
'use strict';

module.exports = {
  name: '@ember-app/project-ui',

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    app.import('node_modules/split.js/src/split.js', {
      using: [
        { transformation: 'es6', as: 'split.js' }
      ]
    });
  }
};
