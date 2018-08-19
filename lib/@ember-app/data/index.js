/* eslint-env node */
'use strict';

module.exports = {
  name: '@ember-app/data',

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this._super.apply(this, arguments);
    app.import('node_modules/@orbit/core/dist/amd/es5/orbit-core.js');
    app.import('node_modules/@orbit/data/dist/amd/es5/orbit-data.js');
    app.import('node_modules/@orbit/indexeddb/dist/amd/es5/orbit-indexeddb.js');
    app.import('node_modules/@orbit/jsonapi/dist/amd/es5/orbit-jsonapi.js');
    app.import(
      'node_modules/@orbit/local-storage-bucket/dist/amd/es5/orbit-local-storage-bucket.js'
    );
    app.import(
      'node_modules/@orbit/indexeddb-bucket/dist/amd/es5/orbit-indexeddb-bucket.js'
    );
  },
};
