import mon from 'monaco-editor';
import conn from './conn';

let editor: undefined | mon.editor.IStandaloneCodeEditor;

export function updateEditor({
  value,
  language,
}: {
  value: string;
  language: 'typescript' | 'javascript';
}) {
  require(['vs/editor/editor.main'], () => {
    if (typeof monaco !== 'undefined' && editor) {
      editor.setValue(value);
      monaco.editor.setModelLanguage(editor.getModel(), language);
    }
  });
}
export function setupEditor(cfg: {
  theme: string;
  value: string;
  language: 'typescript' | 'javascript';
}) {
  require(['vs/editor/editor.main'], async () => {
    if (typeof monaco !== 'undefined') {
      const wrapper = window.document.getElementById('monaco-editor-wrapper');
      if (!wrapper) {
        throw new Error('No wrapper found');
      }
      const { language, theme, value } = cfg;
      const ed = (editor = window.editor = monaco.editor.create(wrapper, {
        language,
        theme,
        value,
      }));
      const client = await conn.promise;
      // TODO: when the code is autocompleted we don't get this even firing
      // For example type a single ', the editor will autocomplete '' we only get
      // the first ', not ''
      ed.onDidChangeModelContent(event => {
        if (!event) {
          return;
        }
        client.onValueChanged({
          event,
          value: ed.getValue(),
        });
      });

      function installResizeWatcher(
        el: HTMLElement,
        fn: (...args: any[]) => any,
        interval: number,
      ) {
        let offset = { width: el.offsetWidth, height: el.offsetHeight };
        setInterval(() => {
          const newOffset = { width: el.offsetWidth, height: el.offsetHeight };
          if (
            offset.height !== newOffset.height ||
            offset.width !== newOffset.width
          ) {
            offset = newOffset;
            fn();
          }
        }, interval);
      }
      installResizeWatcher(wrapper, editor.layout.bind(editor), 2000);
    }
  });
}
