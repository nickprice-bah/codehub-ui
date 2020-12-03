import { Community } from '../../../src/components/community';


describe('Test - community : ', () => {
  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
  });

  test('Test instance ', (done) => {
    let test = test;
    let router = { test: test }
    let community = new Community(router);
    expect(community.router.test).toEqual(test);
    done();
  }, testTimeout);


  afterEach( () => {
  });

});
