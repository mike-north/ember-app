import { store } from '@ember-app/data';
import { FileRecord, ProjectRecord } from '@ember-app/data/schema';
import Project from '@ember-app/project';
import Route from '@ember/routing/route';

export default class ProjectRoute extends Route {
  public async model({ id }: { id: string }) {
    const projRecord: ProjectRecord = await store.query(q =>
      q.findRecord({ type: 'project', id }),
    );
    const fileRecords: FileRecord[] = await store.query(q =>
      q.findRelatedRecords({ type: 'project', id }, 'files'),
    );

    if (!projRecord) {
      throw new Error(`Project ${id} not found`);
    }
    const pr = new Project(projRecord, fileRecords);
    return pr;
  }
}

ProjectRoute.prototype.queryParams = {
  editors: {
    as: 'files',
    replace: true,
  },
};
