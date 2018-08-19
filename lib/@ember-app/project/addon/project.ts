import ProjectFile from './file';
import ProjectFolder from './folder';
import { ProjectJSON } from './serializer/project';

export default class Project {
  constructor(
    public name: string = 'default project',
    protected rootFolder: ProjectFolder = new ProjectFolder(''),
  ) {}

  public createFile(name: string, contents: string) {
    const path = name.split('/');
    const filename = path[path.length - 1];
    // todo: validate filename is ok, and type is supported?
    const f = new ProjectFile(filename, contents);
    if (path.length === 1) {
      // create in project root
      this.rootFolder.addFile(f);
    } else {
      // some subfolder
      const folderPath = path.slice(0, path.length - 1);
      const folder = this.getOrCreateFolder(folderPath);
      folder.addFile(f);
    }
  }

  public toJSON(): ProjectJSON {
    return {
      name: this.name,
      rootFolder: this.rootFolder.toJSON(),
    };
  }

  protected findFolder(nameOrPath: string[]): ProjectFolder | null {
    return this.rootFolder.findChildFolder(nameOrPath);
  }
  protected getOrCreateFolder(nameOrPath: string[]): ProjectFolder {
    return this.rootFolder.getOrCreateChildFolder(nameOrPath);
  }
}
