import { EmberTest } from 'ember-qunit-decorators/test-support';
import { suite, test } from 'qunit-decorators';

@suite('Unit | Controller | application')
export class ApplicationControllerTest extends EmberTest {
  // Replace this with your real tests.
  @test
  public 'it exists'(assert: Assert) {
    const controller = this.owner.lookup('controller:application');
    assert.ok(controller);
  }
}
