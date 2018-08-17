import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { classNames, layout } from '@ember-decorators/component';
import Penpal from 'penpal';

@classNames('monaco-editor')
@layout(hbs`<div class="frame-container"></div>`)
export default class CodeEditor extends Component {
  frame?: Window;
  code?: string;
  language?: string;
  _conn!: Penpal.IChildConnectionObject;
  _subscription?: (evt: MessageEvent) => any;
  theme: 'vs-dark' | 'vs-light' = 'vs-dark'; // TODO: proper default value
  onChange?: (...args: any[]) => any;
  constructor() {
    super(...arguments);
    this._subscription = (event: MessageEvent) => {
      // Ignore messages not coming from this iframe
      if (event.source === this.frame && event.data && event.data.updatedCode) {
        debugger;
        if (this.onChange) this.onChange(event.data.updatedCode);
      }
    };
    window.addEventListener('message', this._subscription);
  }

  buildEditorOptions(): object {
    const { code, language, theme } = this;
    return { value: code, language, theme };
  }

  didInsertElement() {
    super.didInsertElement();

    const container = this.element.querySelector<HTMLDivElement>(
      '.frame-container'
    );
    if (!container) throw new Error('No frame container found');
    this._conn = Penpal.connectToChild({
      url: '/ember-app/code-editor/frame.html',
      appendTo: container
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
  willDestroyElement() {
    super.willDestroyElement();
    if (this._subscription) {
      window.removeEventListener('message', this._subscription);
    }
  }
}
