import { FileRecord, ProjectRecord } from '@ember-app/data/schema';
import ProjectFile from './file';
import ProjectFolder from './folder';
import { ProjectJSON } from './serializer/project';

export default class Project {
  protected rootFolder: ProjectFolder = new ProjectFolder('');
  constructor(protected record: ProjectRecord, files?: FileRecord[]) {
    if (files !== void 0) {
      files.map(this.deserializeFile.bind(this));
    }
  }
  get name(): string {
    return this.record.attributes.name;
  }
  set name(val: string) {
    this.record.attributes.name = val;
  }

  public deserializeFile(fileRecord: FileRecord): ProjectFile {
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

  public allFiles(): Array<Readonly<ProjectFile>> {
    return this.rootFolder.allFiles();
  }

  public toJSON(): ProjectJSON {
    return {
      name: this.name,
      rootFolder: this.rootFolder.toJSON(),
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
      f => f.name === fileName,
    )[0];
    return file || null;
  }

  protected findFolder(nameOrPath: string[]): ProjectFolder | null {
    return this.rootFolder.findChildFolder(nameOrPath);
  }

  protected getOrCreateFolder(nameOrPath: string[]): ProjectFolder {
    return this.rootFolder.getOrCreateChildFolder(nameOrPath);
  }
}
