import { action, computed } from '@ember-decorators/object';
import Controller from '@ember/controller';

export default class Project extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  public editorList = [] as string[];

  @computed('editorList.[]')
  get editors(): string {
    return this.editorList.join(',');
  }
  set editors(v: string) {
    this.editorList.setObjects(v.split(','));
  }
  @action
  public openEditor(fileName: string) {
    this.editorList.setObjects([fileName]);
    this.notifyPropertyChange('editorList');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    project: Project;
  }
}
