import { FileType } from '@ember-app/project/file';
import { helper } from '@ember/component/helper';

export function filetypeToLanguage([ft]: [FileType] /*, hash*/) {
  switch (ft) {
    case FileType.JavaScript:
      return 'javascript';
    case FileType.TypeScript:
      return 'typescript';
    case FileType.HTML:
      return 'html';
    case FileType.CSS:
      return 'css';
    case FileType.SCSS:
      return 'scss';
    case FileType.JSON:
      return 'json';
    default:
      return 'txt';
  }
}

export default helper(filetypeToLanguage);
