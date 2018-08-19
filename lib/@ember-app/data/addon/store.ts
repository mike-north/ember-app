import Coordinator, { SyncStrategy } from '@orbit/coordinator';
import IndexedDBSource from '@orbit/indexeddb';
import IndexedDBBucket, { supportsIndexedDB } from '@orbit/indexeddb-bucket';
import JSONAPISource from '@orbit/jsonapi';
import LocalStorageBucket from '@orbit/local-storage-bucket';
import Store from '@orbit/store';
import Logger, { Level } from 'bite-log';
import schema from './schema';

const l = new Logger(Level.debug);

const bucket = supportsIndexedDB()
  ? new IndexedDBBucket({ namespace: '@ember-app' })
  : new LocalStorageBucket({ namespace: '@ember-app' });

const remote = new JSONAPISource({
  host: 'http://api.example.com',
  name: 'remote',
  schema,
});

const store = new Store({ schema, bucket, name: 'store' });
store.on('transform', (t: any) => {
  l.log('transform', t);
});

const backup = new IndexedDBSource({
  bucket,
  name: 'backup',
  namespace: 'solarsystem',
  schema,
});

const coordinator = new Coordinator({
  sources: [store, backup, remote],
});

// Backup everything in idb for offline use
const backupStoreSync = new SyncStrategy({
  blocking: true,
  source: 'store',
  target: 'backup',
});

coordinator.addStrategy(backupStoreSync);

// // Query the remote server whenever the store is queried
// coordinator.addStrategy(
//   new RequestStrategy({
//     source: 'store',
//     on: 'beforeQuery',
//     target: 'remote',
//     action: 'pull',
//     blocking: false
//   })
// );
// // Update the remote server whenever the store is updated
// coordinator.addStrategy(
//   new RequestStrategy({
//     source: 'store',
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
//     target: 'store',
//     blocking: false
//   })
// );

coordinator.activate(); // returns a promise that resolves when all strategies have been activated

export default store;
