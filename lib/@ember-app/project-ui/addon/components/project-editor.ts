import Project from '@ember-app/project';
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
  public file: Readonly<ProjectFile> | undefined;
  public onOpenEditor?: (s: string) => void;
  public _fileNamesOpen?: string;
  public fileNamesOpen?: string[];
  public project!: Project;
  public didReceiveAttrs() {
    const { _fileNamesOpen, fileNamesOpen } = this;
    if (
      !fileNamesOpen ||
      fileNamesOpen.length === 0 ||
      (fileNamesOpen.length === 1 && fileNamesOpen[0] === '')
    ) {
      return;
    }
    const a = _fileNamesOpen;
    const b = (fileNamesOpen || []).sort().join();
    if (a !== b) {
      const f = this.project.findFile(fileNamesOpen[0]);
      this.set('file', f || undefined);
    }
    this._fileNamesOpen = b;
  }

  @action
  public onFileChosen(file: ProjectFile, evt: MouseEvent) {
    evt.preventDefault();
    if (this.onOpenEditor) {
      this.onOpenEditor(file.path.join('/'));
    }
    // this.set('file', file);
  }
  @action
  public onFileChanged(file: ProjectFile, contents: string) {
    file.contents = contents;
    file.save();
  }
}
