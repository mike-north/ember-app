import { restoreSavedState } from '@ember-app/data';
import Route from '@ember/routing/route';

export default class Application extends Route {
  public beforeModel() {
    return restoreSavedState();
  }
}
