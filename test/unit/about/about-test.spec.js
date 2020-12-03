import { About } from '../../../src/about/about';

describe('Test - about : ', () => {

  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
  });

  test('Test instance of the component', (done) => {
    let about = new About({},{});
    expect(about.message).not.toBeNull();
    done();
  }, testTimeout);

});
