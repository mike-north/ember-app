import { EmberTest } from 'ember-qunit-decorators/test-support';
import { suite, test } from 'qunit-decorators';

@suite('Unit | Route | index')
export class IndexRouteTest extends EmberTest {
  @test
  public 'it exists'(assert: Assert) {
    const route = this.owner.lookup('route:index');
    assert.ok(route);
  }
}
