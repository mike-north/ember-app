import Component from '@ember/component';
import { layout, classNames, tagName } from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';

@classNames('file-tree')
@tagName('ol')
@layout(hbs`
{{project-editor/file-tree/folder-children model=project.rootFolder path=''}}
{{yield}}
`)
export default class ProjectEditorFileTree extends Component {

};
