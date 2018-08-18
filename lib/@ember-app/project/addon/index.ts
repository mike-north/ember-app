import Project from '@ember-app/project/project';
import ProjectSerializer from '@ember-app/project/serializer/project';

export { default } from './project';

export function sampleProject(): Project {
  const proj = new Project('sample');
  proj.createFile('index.ts', 'const x: string = "foo";');
  const j = proj.toJSON();
  console.log(j);
  console.log(ProjectSerializer.instance.fromJSON(j));
  return proj;
}
