import Component from '@ember/component';
import { layout, classNames } from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';

@classNames('project-editor')
@layout(hbs`
{{#if hasBlock}}
  {{yield (hash
    ui=(hash
      tree=(component "project-editor/file-tree" project=project)
    )
  )}}
{{else}}
{{project-editor/file-tree project=project}}
  <div class="editors">
  {{code-editor
    code='<h1>Hello HTML</h1>'
    language="html"}}
  </div>
{{/if}}
`)
export default class ProjectEditor extends Component {

}
