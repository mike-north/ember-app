import { schema, store } from '@ember-app/data';
import ProjectFile from '@ember-app/project/file';
import { classNames, layout } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import Logger, { Level } from 'bite-log';
import hbs from 'htmlbars-inline-precompile';

const logger = new Logger(Level.debug);
logger.pushPrefix('ProjectEditor');

@classNames('project-editor')
@layout(hbs`
{{#if hasBlock}}
  {{yield (hash
    ui=(hash
      header=(component "project-editor/header"               project=project)
      sidebar=(component "project-editor/sidebar"             project=project)
      browser=(component "project-editor/browser"             project=project)
      codeEditors=(component "project-editor/code-editors"    project=project
        acts=(hash
          onFileChanged=(action onFileChanged)
        )
      )
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
    {{project-editor/code-editors file=file project=project
      acts=(hash
        onFileChanged=(action onFileChanged)
      )
    }}
    {{project-editor/browser        project=project}}
  </main>
  {{project-editor/footer           project=project}}
{{/if}}
`)
export default class ProjectEditor extends Component {
  public file: ProjectFile | undefined;
  @action
  public onFileChosen(file: ProjectFile, evt: MouseEvent) {
    evt.preventDefault();
    logger.bgBlue.white.txt(' opened ').debug(' ' + file.fullPath.join('/'));
    this.set('file', file);
  }
  @action
  public onFileChanged(file: ProjectFile, contents: string) {
    file.contents = contents;
    file.save();
  }
}
