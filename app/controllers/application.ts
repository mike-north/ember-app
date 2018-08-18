import Controller from '@ember/controller';
import { sampleProject } from '@ember-app/project';

export default class Application extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  project = sampleProject()
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'application': Application;
  }
}
