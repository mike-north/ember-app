import { helper } from '@ember/component/helper';

export function eq([a, b]: [any, any] /*, hash*/) {
  return a === b;
}

export default helper(eq);
