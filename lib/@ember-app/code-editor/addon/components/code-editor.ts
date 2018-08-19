import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { classNames, layout } from '@ember-decorators/component';
import Penpal from 'penpal';
import { debounce } from '@ember/runloop';

@classNames('monaco-editor')
@layout(hbs`<div class="frame-container"></div>`)
export default class CodeEditor extends Component {
  code?: string;
  _lastCode?: string = this.code;
  language?: string;
  _conn!: Penpal.IChildConnectionObject;
  theme: 'vs-dark' | 'vs-light' = 'vs-dark'; // TODO: proper default value
  onChange?: (v: string) => any;

  buildEditorOptions(): object {
    const { code, language, theme } = this;
    return { value: code, language, theme };
  }

  onEditorTextChanged({ value }: { value: string, event: any }) {
    if (value === this.code) { // if our editor is already up to date
      return; // no change
    }
    this.code = this._lastCode = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  didInsertElement() {
    super.didInsertElement();
    const container = this.element.querySelector<HTMLDivElement>(
      '.frame-container'
    );
    if (!container) throw new Error('No frame container found');
    this._conn = Penpal.connectToChild({
      url: '/ember-app/code-editor/frame.html',
      appendTo: container,
      methods: {
        onValueChanged: this.onEditorTextChanged.bind(this)
      }
    });
    this._conn.promise.then(frameApi => {
      const { code, theme, language } = this;
      frameApi.setupEditor({
        language,
        theme,
        value: code
      });
    });
  }

  didUpdateAttrs() {
    if (this.code !== this._lastCode) {
      this.updateFrame();
    }
    this._lastCode = this.code;
  }

  updateFrame() {
    this._conn.promise.then(frameApi => {
      const { code, language } = this;
      frameApi.updateEditor({
        language,
        value: code
      });
    });
  }

  willDestroyElement() {
    super.willDestroyElement();
    this._conn.destroy();
  }
}
