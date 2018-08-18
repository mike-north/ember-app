import { FileJSON } from "./serializer/file";

export default class ProjectFile {
  constructor(
    protected name: string,
    protected contents: string) {}
  public toJSON(): FileJSON {
    const { name, contents } = this;
    return {
      name, contents
    }
  }
}
