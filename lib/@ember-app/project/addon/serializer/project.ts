import Project from '../project';
import BaseSerializer from './base';
import FolderSerializer, { FolderJSON } from './folder';

export interface ProjectJSON {
  name: string;
  rootFolder: FolderJSON;
}

export default class ProjectSerializer extends BaseSerializer<
  Project,
  ProjectJSON
> {
  public static instance: ProjectSerializer = new ProjectSerializer();
  protected constructor() {
    super();
  }
  public fromJSON(val: ProjectJSON): Project {
    const rootFolder = FolderSerializer.instance.fromJSON(val.rootFolder);
    return new Project(val.name, rootFolder);
  }
  public toJSON(val: Project): ProjectJSON {
    return val.toJSON();
  }
}
