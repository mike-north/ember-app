import { suite, test } from 'qunit-decorators';
import { EmberTest } from 'ember-qunit-decorators/test-support';

@suite('Unit | Controller | project')
export class ProjectControllerTest extends EmberTest {

  // Replace this with your real tests.
  @test 'it exists'(assert: Assert) {
    let controller = this.owner.lookup('controller:project');
    assert.ok(controller);
  }
}
