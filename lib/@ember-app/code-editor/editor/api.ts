import Penpal from 'penpal';
import { setupEditor } from "./editor-loader";

Penpal.connectToParent({
  methods: {
    setupEditor
  }
});

export default {};
