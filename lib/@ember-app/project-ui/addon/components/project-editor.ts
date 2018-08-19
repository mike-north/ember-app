import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import hbs from 'htmlbars-inline-precompile';
import { layout, classNames } from '@ember-decorators/component';
import ProjectFile from '@ember-app/project/file';
import Logger, { Level } from 'bite-log';
import { store, schema } from '@ember-app/data';

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
  file: ProjectFile | undefined;
  @action
  onFileChosen(file: ProjectFile, evt: MouseEvent) {
    evt.preventDefault();
    logger.bgBlue.white.txt(' opened ')
      .debug(' ' + file.fullPath.join('/'));
    this.set('file', file);
  }
  @action
  onFileChanged(file: ProjectFile, contents: string) {
    file.contents = contents;
    logger.bgYellowGreen.txt(' updated ')
      .debug(' ' + file.fullPath.join('/'), file.contents);
      const rec = {
        type: 'planet',
        // id: '4',
        attributes: {
          name: 'earth'
        }
      } as any;
    schema.initializeRecord(rec);

    console.log(`transforms: ${store.transformLog.length}`);
    store.update(t => t.addRecord(rec))
      .then(() => {
        // Verify that the transform log has grown
        console.log(`transforms: ${store.transformLog.length}`);
      });

  }
}
