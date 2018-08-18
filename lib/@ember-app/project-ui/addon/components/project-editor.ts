import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { layout, classNames } from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';
import ProjectFile from '@ember-app/project/file';

@classNames('project-editor')
@layout(hbs`
{{#if hasBlock}}
  {{yield (hash
    ui=(hash
      header=(component "project-editor/header"               project=project)
      sidebar=(component "project-editor/sidebar"             project=project)
      browser=(component "project-editor/browser"             project=project)
      codeEditors=(component "project-editor/code-editors"    project=project)
      footer=(component "project-editor/footer"               project=project)
    )
  )}}
{{else}}
  {{project-editor/header           project=project}}
  <main>
    {{project-editor/sidebar        project=project
      acts=(hash
        onFileChosen=(action onFileChosen)
      )}}
    {{project-editor/code-editors file=file project=project}}
    {{project-editor/browser        project=project}}
  </main>
  {{project-editor/footer           project=project}}
{{/if}}
`)
export default class ProjectEditor extends Component {
  file: ProjectFile | undefined;
  @action
  onFileChosen(file: ProjectFile, evt: MouseEvent) {
    evt.preventDefault();
    console.log('file chosen: ', file.fullPath.join('/'), file.contents);
    this.set('file', file);
  }
}
