import BaseSerializer from "./base";
import FileSerializer, { FileJSON } from "./file";
import ProjectFolder from "@ember-app/project/folder";

export interface NonLeafFolderJSON {
  name: string;
  files?: FileJSON[];
  folders: FolderJSON[];
}
export interface LeafFolderJSON {
  name: string;
  files: FileJSON[];
}

export type FolderJSON = NonLeafFolderJSON | LeafFolderJSON;


export default class FolderSerializer extends BaseSerializer<ProjectFolder, FolderJSON> {
  fromJSON(val: FolderJSON, parent?: ProjectFolder): ProjectFolder {
    const folder = new ProjectFolder(val.name, parent);
    const { files, folders } = val as {files: FileJSON[], folders: FolderJSON[] };
    if (files !== void 0) {
      folder.addFiles(files.map(FileSerializer.instance.fromJSON))
    }
    if (folders !== void 0) {
      folders
        .map(f => FolderSerializer.instance.fromJSON(f, folder))
        .forEach(folder.addChildFolder);
    }
    return folder;
  }
  toJSON(val: ProjectFolder): FolderJSON {
    return val.toJSON();
  }
  protected constructor() {super();}

  static instance: FolderSerializer = new FolderSerializer();
}
