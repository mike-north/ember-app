import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import Penpal from 'penpal';

export interface CodeEditorKeyCommand {
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  keys: string[];
}

export default class CodeEditor extends Component {
  public code?: string;
  public _lastCode?: string = this.code;
  public language?: string;
  public _conn!: Penpal.IChildConnectionObject;
  public theme: 'vs-dark' | 'vs-light' = 'vs-dark'; // TODO: proper default value
  public onChange?: (v: string) => any;
  public onKeyCommand?: (evt: CodeEditorKeyCommand) => any;

  public buildEditorOptions(): object {
    const { code, language, theme } = this;
    return { value: code, language, theme };
  }

  public _onKeyCommand(evt: CodeEditorKeyCommand) {
    this.onKeyCommand && this.onKeyCommand(evt);
  }
  public onEditorTextChanged({ value }: { value: string; event: any }) {
    if (value === this.code) {
      // if our editor is already up to date
      return; // no change
    }
    this.code = this._lastCode = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  public didInsertElement() {
    super.didInsertElement();
    const container = this.element.querySelector<HTMLDivElement>(
      '.frame-container',
    );
    if (!container) {
      throw new Error('No frame container found');
    }
    this._conn = Penpal.connectToChild({
      appendTo: container,
      methods: {
        onValueChanged: this.onEditorTextChanged.bind(this),
        keyCommand: this._onKeyCommand.bind(this),
      },
      url: '/ember-app/code-editor/frame.html',
    });
    this._conn.promise.then(frameApi => {
      const { code, theme, language } = this;
      frameApi.setupEditor({
        language,
        theme,
        value: code,
      });
    });
  }

  public didUpdateAttrs() {
    if (this.code !== this._lastCode) {
      this.updateFrame();
    }
    this._lastCode = this.code;
  }

  public updateFrame() {
    this._conn.promise.then(frameApi => {
      const { code, language } = this;
      frameApi.updateEditor({
        language,
        value: code,
      });
    });
  }

  public willDestroyElement() {
    super.willDestroyElement();
    this._conn.destroy();
  }
}

CodeEditor.prototype.classNames = ['monaco-editor'];

CodeEditor.prototype.layout = hbs`
<div class="frame-container"></div>
`;
