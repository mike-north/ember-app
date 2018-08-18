import ProjectFile from '@ember-app/project/file';
import { FolderJSON } from './serializer/folder';
import { FileJSON } from './serializer/file';

/**
 * A folder in a code project
 */
export default class ProjectFolder {
  // Subfolders
  protected childFolders?: ProjectFolder[];
  protected files?: ProjectFile[];
  constructor(
    protected name: string,
    protected parent: ProjectFolder | null = null
  ) {
    if (parent) {
      parent.addChildFolder(this);
    }
  }
  get isRoot(): boolean {
    return this.parent === null;
  }

  /**
   * Find a subfolder by name
   * @param nameOrPath the name of the folder to search for
   */
  public findChildFolder(namePath: string[]): ProjectFolder | null {
    if (this.childFolders === void 0) return null;
    for (let f of this.childFolders) {
      if (f.name === namePath[0]) return f.findChildFolder(namePath.slice(1));
    }
    return null;
  }

  /**
   * Add a folder as a child of this folder
   * @param child folder to add as this's child
   */
  public addChildFolder(child: ProjectFolder): void {
    if (this.childFolders === void 0) this.childFolders = [];
    this.childFolders.push(child);
  }

  public addFiles(files: ProjectFile[]) {
    files.forEach(this.addFile.bind(this));
  }

  public addFile(file: ProjectFile) {
    // TODO: throw if file already exists
    if (this.files === void 0) this.files = [];
    this.files.push(file);
  }

  public toJSON(): FolderJSON {
    const { name, childFolders } = this;
    const files: FileJSON[] = (this.files || []).map(f => f.toJSON());
    if (childFolders === void 0) {
      // leaf
      return { name, files };
    } else {
      // non-leaf
      return { name, files, folders: childFolders.map(f => f.toJSON()) };
    }
  }
}
