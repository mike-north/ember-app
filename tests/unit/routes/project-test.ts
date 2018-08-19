import { suite, test } from 'qunit-decorators';
import { EmberTest } from 'ember-qunit-decorators/test-support';

@suite('Unit | Route | project')
export class ProjectRouteTest extends EmberTest {

  @test 'it exists'(assert: Assert) {
    let route = this.owner.lookup('route:project');
    assert.ok(route);
  }
}
