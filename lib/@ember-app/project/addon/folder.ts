import ProjectFile from '@ember-app/project/file';
import { FileJSON } from './serializer/file';
import { FolderJSON } from './serializer/folder';

/**
 * A folder in a code project
 */
export default class ProjectFolder {
  // Subfolders
  protected _childFolders?: ProjectFolder[];
  protected _files?: ProjectFile[];
  constructor(
    protected _name: string,
    protected _parent: ProjectFolder | null = null,
  ) {
    if (_parent) {
      _parent.addChildFolder(this);
    }
  }
  get parent(): ProjectFolder | null {
    return this._parent;
  }
  get name(): string {
    return this._name;
  }
  get isRoot(): boolean {
    return this._parent === null;
  }

  get childFolders(): Array<Readonly<ProjectFolder>> {
    return this._childFolders || [];
  }

  get files(): Array<Readonly<ProjectFile>> {
    return this._files || [];
  }

  /**
   * Find a subfolder by name
   * @param nameOrPath the name of the folder to search for
   */
  public findChildFolder(namePath: string[]): ProjectFolder | null {
    // If no folders exist, immediately return
    if (this._childFolders === void 0) {
      return null;
    }
    // Find a folder that matches, recursing the "find" if a match is found
    const remainingPath = namePath.slice(1);
    for (const f of this._childFolders) {
      if (f._name === namePath[0]) {
        if (remainingPath.length === 0) {
          return f;
        }
        return f.findChildFolder(remainingPath);
      }
    }
    return null; // no match found
  }

  public allFiles(): Array<Readonly<ProjectFile>> {
    const { _childFolders } = this;
    if (!_childFolders) {
      return this.files;
    }
    return this.files.concat(
      _childFolders.reduce(
        (files, folder) => files.concat(folder.allFiles()),
        [] as Array<Readonly<ProjectFile>>,
      ),
    );
  }

  /**
   * Get a subfolder by name, creating on the fly if it does not exist
   * @param nameOrPath the name of the folder to search for
   */
  public getOrCreateChildFolder(namePath: string[]): ProjectFolder {
    // no child folders yet
    if (this._childFolders === void 0) {
      this._childFolders = [];
    }
    let nextFolder: ProjectFolder | undefined;
    if (this._childFolders.length === 0) {
      // first child folder
      nextFolder = new ProjectFolder(namePath[0], this);
    } else {
      // search for an existing subfolder to continue recursing into
      // prettier-ignore
      // tslint-ignore-next-line
      for (let i = 0; i < this._childFolders.length && !!nextFolder; i++) {
        const f = this._childFolders[i];
        if (f._name === namePath[0]) {
          // found!
          nextFolder = f;
        }
      }
      // no subfolder found
      if (typeof nextFolder === 'undefined') {
        nextFolder = new ProjectFolder(namePath[0], this);
      }
    }
    const remainingPath = namePath.slice(1);
    if (remainingPath.length === 0) {
      return nextFolder;
    }
    return nextFolder.getOrCreateChildFolder(remainingPath);
  }

  /**
   * Add a folder as a child of this folder
   * @param child folder to add as this's child
   */
  public addChildFolder(child: ProjectFolder): void {
    if (this._childFolders === void 0) {
      this._childFolders = [];
    }
    this._childFolders.push(child);
  }

  public addFiles(files: ProjectFile[]) {
    files.forEach(this.addFile.bind(this));
  }

  public addFile(file: ProjectFile) {
    // TODO: throw if file already exists
    if (this._files === void 0) {
      this._files = [];
    }
    this._files.push(file);
    file.moveToFolder(this);
  }

  public removeFile(file: ProjectFile) {
    if (this._files === void 0) {
      return;
    }
    const idx = this._files.indexOf(file);
    this._files.splice(idx, 1);
  }

  public toJSON(): FolderJSON {
    const { _name: name, _childFolders } = this;
    const files: FileJSON[] = (this._files || []).map(f => f.toJSON());
    if (_childFolders === void 0) {
      // leaf
      return { name, files };
    } else {
      // non-leaf
      return { name, files, folders: _childFolders.map(f => f.toJSON()) };
    }
  }
}
