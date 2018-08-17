import Component from '@ember/component';
import getFrameById from '../utils/get-frame-by-id';
import hbs from 'htmlbars-inline-precompile';
import { classNames, layout } from '@ember-decorators/component';
import Penpal from 'penpal';

// @layout(hbs`<iframe scrolling="no" border="0" width="100%" height="200px" frameborder="0" src="/ember-app-editor/frame.html" name={{elementId}}></iframe>`)
@classNames('monaco-editor')
@layout(hbs`<div class="frame-container"></div>`)
export default class MonacoEditor extends Component {
  frame?: Window;
  code?: string;
  language?: string;
  _conn!: Penpal.IChildConnectionObject;
  _subscription?: (evt: MessageEvent) => any;
  theme: ('vs-dark' | 'vs-light') = 'vs-dark'; // TODO: proper default value
  onChange?: (...args: any[]) => any;
  constructor () {
    super(...arguments);
    const subscription = (event: MessageEvent) => {
      // Ignore messages not coming from this iframe
      if (event.source === this.frame && event.data && event.data.updatedCode) {
        debugger;
        if (this.onChange) this.onChange(event.data.updatedCode);
      }
    };
    this.set('_subscription', subscription);
    window.addEventListener('message', subscription);
  }

  buildEditorOptions(): object {
    const { code, language, theme } = this;
    return { value: code, language, theme };
  }

  didInsertElement () {
    super.didInsertElement();
    // const frame = getFrameById(this.get('elementId'));
    // if (!frame) throw new Error('no frame found');
    // const frameDoc = frame.document;
    // if (!frameDoc) throw new Error('frame has no contentDocument');
    // this.frame = frame;
    // frameDoc.open();
    //              this.monaco.languages.typescript.typescriptDefaults.addExtraLib(\`${fact}\`, 'ember');
    const cfg = {
      language: 'typescript',
      theme: 'vs-dark',
      value: `import Component from '@ember/component'

@tagName('span')
export default class Foo extends Component {

}`
    };
    const container = this.element.querySelector<HTMLDivElement>('.frame-container');
    if (!container) throw new Error('No frame container found');
    this._conn = Penpal.connectToChild({
      url: "/ember-app-editor/frame.html",
      appendTo: container
    });
  }
  willDestroyElement () {
    super.willDestroyElement();
    if (this._subscription) {
      window.removeEventListener('message', this._subscription);
    }
  }
}
