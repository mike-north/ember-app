import { suite, test } from 'qunit-decorators';
import { EmberTest } from 'ember-qunit-decorators/test-support';

@suite('Unit | Controller | application')
export class ApplicationControllerTest extends EmberTest {

  // Replace this with your real tests.
  @test 'it exists'(assert: Assert) {
    let controller = this.owner.lookup('controller:application');
    assert.ok(controller);
  }
}
