import BaseSerializer from "./base";
import Project from "../project";
import FolderSerializer, { FolderJSON } from "./folder";

export interface ProjectJSON {
  name: string;
  rootFolder: FolderJSON;
}

export default class ProjectSerializer extends BaseSerializer<Project, ProjectJSON> {
  fromJSON(val: ProjectJSON): Project {
    const rootFolder = FolderSerializer.instance.fromJSON(val.rootFolder);
    return new Project(val.name, rootFolder);
  }  toJSON(val: Project): ProjectJSON {
    return val.toJSON();
  }
  protected constructor() {super();}
  static instance: ProjectSerializer = new ProjectSerializer();
}
