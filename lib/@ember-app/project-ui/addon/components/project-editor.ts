import Component from '@ember/component';
import { layout, classNames } from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';

@classNames('project-editor')
@layout(hbs`
{{#if hasBlock}}
  {{yield (hash
    ui=(hash
      header=(component "project-editor/header" project=project)
      sidebar=(component "project-editor/sidebar" project=project)
      browser=(component "project-editor/browser" project=project)
      codeEditors=(component "project-editor/code-editors" project=project)
      footer=(component "project-editor/footer" project=project)
    )
  )}}
{{else}}
  {{project-editor/header project=project}}
  <main>
    {{project-editor/sidebar project=project}}
    {{project-editor/code-editors project=project}}
    {{project-editor/browser project=project}}
  </main>
  {{project-editor/footer project=project}}
{{/if}}
`)
export default class ProjectEditor extends Component {

}
