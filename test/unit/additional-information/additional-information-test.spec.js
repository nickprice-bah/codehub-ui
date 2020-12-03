import { AdditionalInformation } from '../../../src/additional-information/additional-information';

describe('Test - additional-information : ', () => {

  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
  });

  test('Test instance of the component', (done) => {
    let additionalInformation = new AdditionalInformation({},{});
    expect(additionalInformation.message).not.toBeNull();
    done();
  }, testTimeout);

});
