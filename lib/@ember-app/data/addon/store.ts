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
  ? new IndexedDBBucket({ namespace: '@ember-app-bucket' })
  : new LocalStorageBucket({ namespace: '@ember-app-bucket' });

// const remote = new JSONAPISource({
//   host: 'http://api.example.com',
//   name: 'remote',
//   schema,
// });

const store = new Store({ schema, bucket, name: 'store' });

const backup = new IndexedDBSource({
  bucket,
  name: 'backup',
  namespace: '@ember-app-storage',
  schema,
});

export async function restoreSavedState(): Promise<void> {
  l.log('Restoring saved state');
  await backup
    .pull(q => q.findRecords())
    .then(transform => store.sync(transform))
    .then(() => coordinator.activate());
  l.log(store.cache);
}

const coordinator = new Coordinator({
  sources: [store, backup],
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

// coordinator.activate(); // returns a promise that resolves when all strategies have been activated

export default store;
