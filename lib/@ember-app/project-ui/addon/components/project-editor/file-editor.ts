import Component from '@ember/component';
import tmpl from '@ember-app/project-ui/templates/components/project-editor/file-editor';
import { classNames } from '@ember-decorators/component';
import ProjectFile from '@ember-app/project/file';

const EMPTY_FILE = new ProjectFile('no_name.json', '{}');
(EMPTY_FILE as any).empty = true;

@classNames('file-editor')
export default class ProjectEditorFileEditor extends Component {
  file?: ProjectFile;
  constructor() {
    super(...arguments);
    if (!this.file) {
      this.file = EMPTY_FILE;
    }
  }
}
ProjectEditorFileEditor.prototype.layout = tmpl;
