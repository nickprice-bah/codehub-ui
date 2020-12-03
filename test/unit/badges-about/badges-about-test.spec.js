import { Repopublishing } from '../../../src/badges-about/badges-about';

describe('Test - badges-about : ', () => {

  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
  });

  test('Test instance of the component', (done) => {
    let repoPublishing = new Repopublishing({},{});
    expect(repoPublishing.message).not.toBeNull();
    done();
  }, testTimeout);

  test('Test activate', (done) => {
    let repoPublishing = new Repopublishing({},{});
    repoPublishing.activate();
    expect(document.body.scrollTop).toEqual(0);
    done();
  }, testTimeout);

});
