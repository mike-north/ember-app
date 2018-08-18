import { FileJSON } from "./serializer/file";

export default class ProjectFile {
  constructor(
    protected _name: string,
    protected _contents: string) {}
  public toJSON(): FileJSON {
    const { _name: name, _contents: contents } = this;
    return {
      name, contents
    }
  }

  public get name(): string {
    return this._name;
  }
  public get contents(): string {
    return this._contents;
  }
}
