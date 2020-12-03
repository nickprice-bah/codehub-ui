import { BootstrapTooltip } from '../../../../src/resources/custom-attributes/bootstrap-tooltip';


describe('Test - resources/custom-attributes/bootstrap-tooltip : ', () => {

  let testTimeout;
  let mockElement;

  beforeEach( () => {
    testTimeout = 3000;
    mockElement = {};
  });


  test('Test instance ', (done) => {
    let bt = new BootstrapTooltip(mockElement);
    expect(bt.element).not.toBeNull();
    done();
  }, testTimeout);

});
