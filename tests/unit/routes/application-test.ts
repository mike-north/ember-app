import { suite, test } from 'qunit-decorators';
import { EmberTest } from 'ember-qunit-decorators/test-support';

@suite('Unit | Route | application')
export class ApplicationRouteTest extends EmberTest {

  @test 'it exists'(assert: Assert) {
    let route = this.owner.lookup('route:application');
    assert.ok(route);
  }
}
