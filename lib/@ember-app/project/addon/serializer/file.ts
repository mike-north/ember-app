import { JSONObject } from 'ts-std';
import ProjectFile from '../file';
import BaseSerializer from './base';

export interface FileJSON extends JSONObject {
  name: string;
  contents: string;
}

export default class FileSerializer extends BaseSerializer<
  ProjectFile,
  FileJSON
> {
  public static instance = new FileSerializer();
  protected constructor() {
    super();
  }
  public fromJSON(val: FileJSON): ProjectFile {
    return new ProjectFile(val.name, val.contents);
  }
  public toJSON(val: ProjectFile): FileJSON {
    return val.toJSON();
  }
}
