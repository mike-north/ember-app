declare module 'ember-keyboard/services/keyboard' {
  import Service from '@ember/service';
  class KeyboardService extends Service {
    register(thing: any);
    unregister(thing: any);
  }
  export default KeyboardService;
}

declare module 'ember-keyboard' {
  type KeyEvent = string;
  export const keyUp: (code: string) => KeyEvent;
  export const keyDown: (code: string) => KeyEvent;
}

declare module '@ember/service' {
  import KeyboardService from 'ember-keyboard/services/keyboard';
  export interface Registry {
    keyboard: KeyboardService;
  }
}
