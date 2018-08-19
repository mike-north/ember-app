import Store from '@orbit/store';
import schema from './schema';
import IndexedDBSource from '@orbit/indexeddb';
import JSONAPISource from '@orbit/jsonapi';
import Coordinator, { RequestStrategy, SyncStrategy } from '@orbit/coordinator';
import LocalStorageBucket from '@orbit/local-storage-bucket';
import IndexedDBBucket, { supportsIndexedDB } from '@orbit/indexeddb-bucket';

const bucket = supportsIndexedDB()
  ? new IndexedDBBucket({ namespace: '@ember-app' })
  : new LocalStorageBucket({ namespace: '@ember-app' });

const remoteStore = new JSONAPISource({
  schema,
  name: 'remote',
  host: 'http://api.example.com'
});

const memoryStore = new Store({ schema, bucket });
memoryStore.on('transform', (t: any) => {
  console.log('transform', t);
});

const idbStore = new IndexedDBSource({
  schema,
  bucket,
  name: 'backup',
  namespace: 'solarsystem'
});

const coordinator = new Coordinator({
  sources: [memoryStore, idbStore, remoteStore]
});

// const backupStoreSync = new SyncStrategy({
//   source: 'memoryStore',
//   target: 'idbStore',
//   blocking: true
// });

// coordinator.addStrategy(backupStoreSync);

// // Query the remote server whenever the store is queried
// coordinator.addStrategy(
//   new RequestStrategy({
//     source: 'idbStore',
//     on: 'beforeQuery',
//     target: 'remote',
//     action: 'pull',
//     blocking: false
//   })
);
// // Update the remote server whenever the store is updated
// coordinator.addStrategy(
//   new RequestStrategy({
//     source: 'idbStore',
//     on: 'beforeUpdate',
//     target: 'remote',
//     action: 'push',
//     blocking: false
//   })
// );
// // Sync all changes received from the remote server to the store
// coordinator.addStrategy(
//   new SyncStrategy({
//     source: 'remote',
//     target: 'idbStore',
//     blocking: false
//   })
// );
// coordinator.addStrategy(
//   new SyncStrategy({
//     source: 'idbStore',
//     target: 'memoryStore',
//     blocking: false
//   })
// );

coordinator.activate(); // returns a promise that resolves when all strategies have been activated

export default memoryStore;
