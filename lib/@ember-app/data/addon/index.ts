import schema, { FileRecord, ProjectRecord } from './schema';
import store from './store';

export { default as store, restoreSavedState } from './store';
export { default as schema } from './schema';

export async function createProjectRecord(p: {
  name: string;
  files: { [k: string]: string };
}): Promise<ProjectRecord> {
  const fileRecords: FileRecord[] = [];
  for (const f in p.files) {
    if (p.files.hasOwnProperty(f)) {
      const fr: Pick<FileRecord, 'type' | 'attributes'> = {
        attributes: {
          contents: p.files[f],
          name: f,
        },
        type: 'file',
      };
      schema.initializeRecord(fr as any);
      fileRecords.push(fr as any);
    }
  }
  const pr: Pick<ProjectRecord, 'type' | 'attributes' | 'relationships'> = {
    attributes: {
      name: p.name,
    },
    relationships: {
      files: {
        data: fileRecords.map(f => ({ type: 'file', id: f.id })),
      },
    },
    type: 'project',
  };
  schema.initializeRecord(pr as any);
  await store.update(t =>
    fileRecords.map(f => t.addRecord(f)).concat(t.addRecord(pr)),
  );
  return pr as any;
}

// export function projectToRecord(proj: Project) {
//   const files: FileRecord[] = proj.allFiles().map(f => {
//     const fileRecord = {
//       attributes: {
//         contents: f.contents,
//         name: f.name,
//       },
//       type: 'file',
//     };
//     schema.initializeRecord(fileRecord as any);
//     return fileRecord as FileRecord;
//   });

//   const project: ProjectRecord = {
//     attributes: {
//       name: proj.name,
//     },
//     id: undefined as any,
//     relationships: {
//       files: {
//         data: files.map(r => ({ type: 'file', id: r.id })),
//       },
//     },
//     type: 'project',
//   };
//   schema.initializeRecord(project as any);
//   return { project, files };
// }
