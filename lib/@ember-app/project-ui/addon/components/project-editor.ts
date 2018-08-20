import { CodeEditorKeyCommand } from '@ember-app/code-editor/components/code-editor';
import Project from '@ember-app/project';
import StatusIndicatorManager from '@ember-app/project-ui/project-editor/indicator-manager';
import ProjectFile from '@ember-app/project/file';
import ProjectFolder from '@ember-app/project/folder';
import { classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Evented from '@ember/object/evented';
import Logger, { Level } from 'bite-log';
import { keyDown } from 'ember-keyboard';
import KeyboardService from 'ember-keyboard/services/keyboard';
import hbs from 'htmlbars-inline-precompile';

const logger = new Logger(Level.debug);
logger.pushPrefix('ProjectEditor');

@classNames('project-editor')
export default class ProjectEditor extends Component.extend(Evented) {
  public file: Readonly<ProjectFile> | undefined;
  public onOpenEditor?: (s: string) => void;
  public _fileNamesOpen?: string;
  public fileNamesOpen?: string[];
  public project!: Project;
  public showHeader!: boolean;
  public showSidebar!: boolean;
  public showFooter!: boolean;
  public leftFooterIndicators = new StatusIndicatorManager();
  public rightFooterIndicators = new StatusIndicatorManager();
  @service
  public keyboard!: KeyboardService;
  public keyboardPriority = 0;
  public keyboardActivated!: boolean;
  public selectedNode!: ProjectFile | ProjectFolder | null;
  constructor() {
    super(...arguments);
    if (!this.selectedNode) {
      this.selectedNode = null;
    }
    if (this.showHeader === void 0) {
      this.showHeader = true;
    }
    if (this.showFooter === void 0) {
      this.showFooter = true;
    }
    if (this.showSidebar === void 0) {
      this.showSidebar = true;
    }
    this.keyboard.register(this);
  }

  public didInsertElement() {
    super.didInsertElement();
    this.set('keyboardActivated', true);
    this.on(keyDown('KeyS+cmd+shift'), evt => {
      this.cmdSaveAll();
      evt.preventDefault();
    });
    this.on(keyDown('KeyS+cmd'), evt => {
      const { file } = this;
      if (file) {
        this.cmdSave(file);
      }
      evt.preventDefault();
    });
  }

  public didReceiveAttrs() {
    this.performConditionalUpdates();
  }
  public willDestroy() {
    super.willDestroy();
    this.keyboard.unregister(this);
  }
  public willDestroyElement() {
    super.willDestroyElement();
    this.keyboard.unregister(this);
  }

  public performConditionalUpdates() {
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
      this.notifyPropertyChange('fileNamesOpen');
    }
    this._fileNamesOpen = b;
  }
  public cmdSave(file: Readonly<ProjectFile>) {
    logger.bgGreen.white.txt(' save ').log(' ' + file.pathString);
  }
  public cmdSaveAll() {
    logger.bgGreen.white.log(' save all ');
  }

  @action
  public onFileChosen(file: ProjectFile, evt: MouseEvent) {
    evt.preventDefault();
    if (file !== this.selectedNode) {
      this.set('selectedNode', file);
    }
    if (this.onOpenEditor) {
      this.onOpenEditor(file.path.join('/'));
    }
  }
  @action
  public onFolderChosen(folder: ProjectFolder, evt: MouseEvent) {
    if (folder !== this.selectedNode) {
      evt.preventDefault(); // prevent folder from opening
      this.set('selectedNode', folder);
    }
  }
  @action
  public onFileChanged(file: ProjectFile, contents: string) {
    file.contents = contents;
    file.save();
  }
  @action
  public onEditorKeyCommand(file: ProjectFile, evt: CodeEditorKeyCommand) {
    if (evt.cmd && evt.keys.length === 1 && evt.keys[0] === 's') {
      if (evt.shift) {
        this.cmdSaveAll();
      } else {
        this.cmdSave(file);
      }
    }
  }
}

ProjectEditor.prototype.layout = hbs`
{{#if hasBlock}}
  {{yield (hash
    ui=(hash
      header=(component "project-editor/header"               project=project)
      sidebar=(component "project-editor/sidebar"             project=project
        selectedNode=selectedNode
        acts=(hash
          onFileChosen=(action onFileChosen)
          onFolderChosen=(action onFolderChosen)
        )
      )
      browser=(component "project-editor/browser"             project=project)
      codeEditors=(component "project-editor/code-editors"    project=project
        acts=(hash
          onFileChanged=(action onFileChanged)
        )
      )
      footer=(component "project-editor/footer"               project=project
        indicators=footerIndicators
      )
    )
  )}}
{{else}}
  {{#if showHeader}}
    {{project-editor/header           project=project}}
  {{/if}}
  <main>
    {{#if showSidebar}}
      {{project-editor/sidebar        project=project
        selectedNode=selectedNode
        acts=(hash
          onFileChosen=(action onFileChosen)
          onFolderChosen=(action onFolderChosen)
        )
      }}
    {{/if}}
    {{project-editor/code-editors file=file project=project
      acts=(hash
        onFileChanged=(action onFileChanged)
        onEditorKeyCommand=(action onEditorKeyCommand)
      )
    }}
    {{project-editor/browser        project=project}}
  </main>
  {{#if showFooter}}
    {{project-editor/footer           project=project
      leftIndicators=leftFooterIndicators
      rightIndicators=rightFooterIndicators
    }}
  {{/if}}
{{/if}}
`;
