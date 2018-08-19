import ProjectFolder from './folder';
import { FileJSON } from './serializer/file';

export enum FileType {
  JavaScript,
  TypeScript,
  HTML,
  CSS,
  SCSS,
  JSON,
  Unknown = -1,
}

function detectFileType(fileName: string): FileType {
  if (/.js$/.test(fileName)) {
    return FileType.JavaScript;
  }
  if (/.ts$/.test(fileName)) {
    return FileType.TypeScript;
  }
  if (/.html$/.test(fileName)) {
    return FileType.HTML;
  }
  if (/.css$/.test(fileName)) {
    return FileType.CSS;
  }
  if (/.scss$/.test(fileName)) {
    return FileType.SCSS;
  }
  if (/.json$/.test(fileName)) {
    return FileType.JSON;
  }
  return FileType.Unknown;
}

export default class ProjectFile {
  public get fileType(): FileType {
    if (!this._fileType) {
      this._fileType = detectFileType(this._name);
    }
    return this._fileType;
  }

  public get fullPath(): string[] {
    const parts: string[] = [];
    parts.push(this._name);
    let folder: ProjectFolder | null = this.folder;
    while (folder) {
      parts.push(folder.name);
      folder = folder.parent;
    }
    return parts.reverse();
  }
  public get name(): string {
    return this._name;
  }
  public get contents(): string {
    return this._contents;
  }
  public set contents(newVal: string) {
    this._contents = newVal;
  }
  private _fileType: FileType | null = null;
  constructor(
    protected _name: string,
    protected _contents: string,
    public folder: ProjectFolder | null = null,
  ) {}
  public toJSON(): FileJSON {
    const { _name: name, _contents: contents } = this;
    return {
      contents,
      name,
    };
  }
  public moveToFolder(folder: ProjectFolder) {
    if (this.folder) {
      this.folder.removeFile(this);
    }
    this.folder = folder;
  }
}
