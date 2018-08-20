import tmpl from '@ember-app/project-ui/templates/components/project-editor/file-editor';
import ProjectFile from '@ember-app/project/file';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';

const EMPTY_FILE = new ProjectFile({
  type: 'file',
  id: '',
  attributes: {
    contents: '',
    name: 'no_name.txt',
  },
});
(EMPTY_FILE as any).empty = true;

@classNames('file-editor')
export default class ProjectEditorFileEditor extends Component {
  public file?: ProjectFile;
  constructor() {
    super(...arguments);
    if (!this.file) {
      this.file = EMPTY_FILE;
    }
  }
}
ProjectEditorFileEditor.prototype.layout = tmpl;
