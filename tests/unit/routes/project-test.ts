import { EmberTest } from 'ember-qunit-decorators/test-support';
import { suite, test } from 'qunit-decorators';

@suite('Unit | Route | project')
export class ProjectRouteTest extends EmberTest {
  @test
  public 'it exists'(assert: Assert) {
    const route = this.owner.lookup('route:project');
    assert.ok(route);
  }
}
