import CodeEditorState from "@ember-app/project-ui/project-editor/code-editor-state";
import ProjectFile from "@ember-app/project/file";

export default class ProjectEditorState {
  public codeEditors: CodeEditorState[] = [];
  openOrFocusEditor(file: ProjectFile) {
    const existingEditor: CodeEditorState | undefined = this.codeEditors.filter(e => e.file === file)[0];
    if (existingEditor) {
      // TODO: focus
    } else {
      // TODO: open
    }
  }
}
