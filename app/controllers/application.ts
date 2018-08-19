import { sampleProject } from '@ember-app/project';
import Controller from '@ember/controller';

export default class ApplicationController extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  public project = sampleProject();
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    application: ApplicationController;
  }
}
