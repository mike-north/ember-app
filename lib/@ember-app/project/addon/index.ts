import Project from '@ember-app/project/project';

export { default } from './project';

export function sampleProject(): Project {
  const proj = new Project('sample');
  proj.createFile('package.json', '{ }');
  proj.createFile('app/app.ts', 'const x: string = "foo";');
  proj.createFile('app/components/x-foo.ts', 'const x: string = "foo";');
  proj.createFile('addon/components/x-foo.ts', 'const x: string = "foo";');
  proj.createFile('addon/.eslintrc.js', `module.exports = {
  a: 'foo',
  b: 44,
  c: [2, '17']
};`);
  console.log(proj.toJSON());
  return proj;
}
