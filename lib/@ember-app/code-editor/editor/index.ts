declare global {
  const monaco: { editor: any } | undefined;
  function require(deps: string[], cb: ((...args: any[]) => any)): void;
}


import api from './api';
(window as any).api = api;
