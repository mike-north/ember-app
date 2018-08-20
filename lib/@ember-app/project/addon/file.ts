import { store } from '@ember-app/data';
import { FileRecord } from '@ember-app/data/schema';
import ProjectFolder from './folder';
import { RecordObject, SaveResult } from '@ember-app/project/base';

export interface FileAbbrevJSON {
  name: string;
  contents: string;
}

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

export default class ProjectFile<
  R extends Pick<FileRecord, 'attributes' | 'type' | 'id'> = Pick<
    FileRecord,
    'attributes' | 'type' | 'id'
  >
> extends RecordObject<R, FileAbbrevJSON> {
  private _fileType: FileType | null = null;
  constructor(protected record: R, protected folder?: ProjectFolder) {
    super(record);
  }
  public get fileType(): FileType {
    if (!this._fileType) {
      this._fileType = detectFileType(this.fileName);
    }
    return this._fileType;
  }

  public get path(): Readonly<string[]> {
    return this.record.attributes.name.split('/');
  }
  public get pathString(): string {
    return this.path.join('/');
  }
  public get fileName(): string {
    const { path } = this;
    return path[path.length - 1];
  }
  public get displayName(): string {
    return this.fileName;
  }
  public get contents(): string {
    return this.record.attributes.contents;
  }
  public set contents(newVal: string) {
    this.record.attributes.contents = newVal;
  }
  public toJSON(): FileAbbrevJSON {
    const { fileName: name, contents } = this;
    return {
      contents,
      name,
    };
  }
  public async save(): Promise<SaveResult<R>> {
    try {
      await store.update(t => t.replaceRecord(this.record));
      return ['ok', this.record];
    } catch (e) {
      return ['error', e];
    }
  }
  public moveToFolder(folder: ProjectFolder) {
    if (this.folder) {
      this.folder.removeFile(this);
    }
    this.folder = folder;
  }
}
