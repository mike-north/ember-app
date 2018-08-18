import ProjectFolder from "./folder";
import ProjectFile from "./file";
import { ProjectJSON } from "./serializer/project";

export default class Project {
  constructor(
    public name: string = 'default project',
    protected rootFolder: ProjectFolder = new ProjectFolder('')){}

  protected findFolder(nameOrPath: string[]): ProjectFolder | null {
    return this.rootFolder.findChildFolder(nameOrPath);
  }

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
      const folder = this.findFolder(folderPath);
      // TODO create folder on the fly
      if (!folder) throw new Error('folder does not exist');
      folder.addFile(f);
    }
  }

  public toJSON(): ProjectJSON {
    return {
      name: this.name,
      rootFolder: this.rootFolder.toJSON()
    }
  }
}
