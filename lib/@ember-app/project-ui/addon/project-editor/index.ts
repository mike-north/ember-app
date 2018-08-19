import { Observable, Subject } from 'micro-observable';
import ProjectEditorState from './state';

export default class ProjectEditor {
  public state: ProjectEditorState = new ProjectEditorState();
  private stateSubj = new Subject<ProjectEditorState>();
  get stateObservable(): Observable<ProjectEditorState> {
    return this.stateSubj;
  }
}
