import Penpal from 'penpal';
import { setupEditor, updateEditor } from "./editor-loader";

Penpal.connectToParent({
  methods: {
    setupEditor,
    updateEditor,
  }
});

export default {};
