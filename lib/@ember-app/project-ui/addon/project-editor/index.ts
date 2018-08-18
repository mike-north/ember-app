import ProjectEditorState from "./state";
import { Subject, Observable } from 'micro-observable';

export default class ProjectEditor {
  state: ProjectEditorState = new ProjectEditorState();
  private stateSubj = new Subject<ProjectEditorState>();
  get stateObservable(): Observable<ProjectEditorState> {
    return this.stateSubj;
  }
}
