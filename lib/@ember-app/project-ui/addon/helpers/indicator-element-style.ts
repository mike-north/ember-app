import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { StatusIndicatorElement } from '../project-editor/indicator-manager';

export function indicatorElementStyle(
  [elem]: [StatusIndicatorElement] /*, hash*/,
) {
  const parts: [string, string][] = [];
  if (elem.bgColor) {
    parts.push(['background-color', elem.bgColor]);
  }
  if (elem.color) {
    parts.push(['color', elem.color]);
  }
  return htmlSafe(parts.map(p => `${p[0]}: ${p[1]}`).join(';'));
}

export default helper(indicatorElementStyle);
