
interface EditorConfig {
  theme: string;
  value: string;
  language: 'typescript' | 'javascript'
}

export function updateEditor({value, language}: {
  value: string;
  language: 'typescript' | 'javascript'
}) {
  require(['vs/editor/editor.main'], function () {
    if (typeof monaco !== "undefined") {
      window.editor.setValue(value);
      monaco.editor.setModelLanguage(window.editor.getModel(), language);
    }
  });
}
export function setupEditor(cfg: {
  theme: string;
  value: string;
  language: 'typescript' | 'javascript'
}) {
  require(['vs/editor/editor.main'], function () {
    if (typeof monaco !== "undefined") {
      const wrapper = window.document.getElementById('monaco-editor-wrapper');
      if (!wrapper) throw new Error('No wrapper found');
      const { language, theme, value } = cfg;
      var editor = monaco.editor.create(
        wrapper, {
          language,
          theme,
          value,
          automaticLayout: true
        }
      );
      window.editor = editor;

      var origin = window.location.origin;
      // TODO: when the code is autocompleted we don't get this even firing
      // For example type a single ', the editor will autocomplete '' we only get
      // the first ', not ''
      editor.onDidChangeModelContent((event: MessageEvent) => {
        if (!event) return;
        const target: HTMLTextAreaElement | null = event.target as any;
        if (!target) return;
        window.top.postMessage({updatedCode: target.value}, origin);
      });

      // function installResizeWatcher(el: HTMLElement, fn: (...args: any[]) => any, interval: number){
      //   let offset = {width: el.offsetWidth, height: el.offsetHeight}
      //   setInterval(()=>{
      //     let newOffset = {width: el.offsetWidth, height: el.offsetHeight}
      //     if(offset.height!=newOffset.height||offset.width!=newOffset.width){
      //       offset = newOffset
      //       fn()
      //     }
      //   }, interval)
      // }
      // installResizeWatcher(wrapper, editor.layout.bind(editor), 2000)
    }
  });
}
