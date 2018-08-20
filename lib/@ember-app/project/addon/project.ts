import { store } from '@ember-app/data';
import { FileRecord, ProjectRecord } from '@ember-app/data/schema';
import { BaseObject, RecordObject, SaveResult } from '@ember-app/project/base';
import ProjectFile, { FileAbbrevJSON } from './file';
import ProjectFolder from './folder';

export interface ProjectAbbrevJSON {
  name: string;
  files: FileAbbrevJSON[];
}

export default class Project
  extends RecordObject<ProjectRecord, ProjectAbbrevJSON>
  implements BaseObject {
  // WritableBaseObject
  get name(): string {
    return this.record.attributes.name;
  }
  set name(val: string) {
    this.record.attributes.name = val;
    this.save();
  }
  get path() {
    return [];
  }
  // tslint:disable-next-line:no-empty
  public readonly pathString = '';
  protected rootFolder: ProjectFolder = new ProjectFolder('');

  constructor(record: ProjectRecord, files?: FileRecord[]) {
    super(record);
    if (files !== void 0) {
      files.map(this.deserializeFile.bind(this));
    }
  }

  public async save(): Promise<SaveResult<ProjectRecord>> {
    try {
      await store.update(t => t.replaceRecord(this.record));
      return ['ok', this.record];
    } catch (e) {
      return ['error', e];
    }
  }

  public allFiles(): Array<Readonly<ProjectFile>> {
    return this.rootFolder.allFiles();
  }

  public toJSON(): ProjectAbbrevJSON {
    return {
      files: this.allFiles().map(f => f.toJSON()),
      name: this.name,
    };
  }

  public findFile(name: string): Readonly<ProjectFile> | null {
    const folderPath: string[] = name.split('/');
    const fileName = folderPath.pop();
    if (!fileName) {
      throw new Error(`Invalid file name: "${name}"`);
    }
    const folder =
      folderPath.length === 0 ? this.rootFolder : this.findFolder(folderPath);
    if (!folder) {
      throw new Error(
        `Could not find containing folder: "${folderPath.join(
          '/',
        )}" for file "${name}"`,
      );
    }
    const file: Readonly<ProjectFile> | undefined = folder.files.filter(
      f => f.fileName === fileName,
    )[0];
    return file || null;
  }

  protected findFolder(nameOrPath: string[]): ProjectFolder | null {
    return this.rootFolder.findChildFolder(nameOrPath);
  }

  protected getOrCreateFolder(nameOrPath: string[]): ProjectFolder {
    return this.rootFolder.getOrCreateChildFolder(nameOrPath);
  }

  private deserializeFile(fileRecord: FileRecord): ProjectFile {
    const { name } = fileRecord.attributes;
    const path = name.split('/');
    // todo: validate filename is ok, and type is supported?
    const f = new ProjectFile(fileRecord);
    if (path.length === 1) {
      // create in project root
      this.rootFolder.addFile(f);
    } else {
      // some subfolder
      const folderPath = path.slice(0, path.length - 1);
      const folder = this.getOrCreateFolder(folderPath);
      folder.addFile(f);
    }
    return f;
  }
}
