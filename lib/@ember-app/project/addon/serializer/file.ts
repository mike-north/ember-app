import BaseSerializer from "./base";
import ProjectFile from "../file";
import { JSONObject } from "ts-std";

export interface FileJSON extends JSONObject {
  name: string;
  contents: string;
}

export default class FileSerializer extends BaseSerializer<ProjectFile, FileJSON> {
  fromJSON(val: FileJSON): ProjectFile {
    return new ProjectFile(val.name, val.contents);
  }  toJSON(val: ProjectFile): FileJSON {
    return val.toJSON();
  }
  protected constructor() {super();}

  public static instance = new FileSerializer();
}
