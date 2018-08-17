declare global {
  const monaco: { editor: any } | undefined;
  function require(deps: string[], cb: ((...args: any[]) => any)): void;
}

interface EditorConfig {
  theme: string;
  value: string;
  language: 'typescript' | 'javascript'
}

export function setupEditor(cfg: EditorConfig) {
  require(['vs/editor/editor.main'], function () {
    if (typeof monaco !== "undefined") {

      const { language, theme, value } = cfg;
      var editor = monaco.editor.create(
        window.document.getElementById('monaco-editor-wrapper'), {
          language,
          theme,
          value
        }
      );

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
    }
  });
}
