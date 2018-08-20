import { helper } from '@ember/component/helper';
import { FooterIndicatorElement } from '@ember-app/project-ui/components/project-editor';
import { htmlSafe } from '@ember/string';

export function indicatorElementStyle(
  [elem]: [FooterIndicatorElement] /*, hash*/,
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
