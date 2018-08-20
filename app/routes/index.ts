import { createProjectRecord, store } from '@ember-app/data';
// import { sampleProject } from '@ember-app/project';
import { action } from '@ember-decorators/object';
import Route from '@ember/routing/route';

export default class Index extends Route {
  @action
  public async createProject() {
    const project = await createProjectRecord({
      files: {
        'package.json': '{}',
        'index.html': `<html>
<body>
  <h1>Hello Fake Browser</h1>
</body>
`,
      },
      name: 'HTML only',
    });
    this.transitionTo('project', project.id);
  }

  public async model() {
    return await store.query(q => q.findRecords('project'));
  }
}
