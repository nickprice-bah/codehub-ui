import { DataContext } from '../../../src/services/datacontext';
import { StageConfig } from '../../../src/stageConf';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import MockMetricsData from '../../mockdata/mock-metrics-data.json';
import MockCategoriesData from '../../mockdata/mock-categories-data.json';

export class MockHttpClient {
  responseData = undefined;
  responseCode = undefined;
  responseOk = undefined;
  fetch(url, params) {
    return new Promise((resolve, reject) => {
      resolve({
        json: () => { return {
          code: this.responseCode,
          result: this.responseData
        } },
        ok: this.responseOk
      })
    })
  }
}

describe('Test - service/datacontext : ', () => {

  let testTimeout;
  let mockHttpClient;
  let stageConfig;

  beforeEach( () => {
    testTimeout = 30000;
    mockHttpClient = new MockHttpClient();
    stageConfig = StageConfig;
  });


  test('Test instance of the component', (done) => {
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    expect(dc.stageConfig).not.toBeNull();
    done();
  }, testTimeout);

  test('Test getRepositories data no owners', (done) => {
    mockHttpClient.responseData = MockRepositoriesData;
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getRepositories(null).then( r => {
      expect(r.length).toEqual(MockRepositoriesData.length);
      done();
    });
  }, testTimeout);

  test('Test getRepositories no data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData;
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getRepositories(null).then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test findPopular data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData.filter(x => x.codehubData.badges.isFeatured == true);
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findPopular(null).then( r => {
      expect(r.length).toEqual(1);
      done();
    });
  }, testTimeout);

  test('Test findPopular no data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData.filter(x => x.codehubData.badges.isFeatured == true);
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findPopular(null).then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test findFeatured data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData.filter(x => x.codehubData.badges.isFeatured == true);
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findFeatured(null).then( r => {
      expect(r.length).toEqual(1);
      done();
    });
  }, testTimeout);

  test('Test findFeatured no data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData.filter(x => x.codehubData.badges.isFeatured == true);
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findFeatured(null).then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test getMetrics data', (done) => {
    mockHttpClient.responseData = MockMetricsData;
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getMetrics(null).then( r => {
      expect(r.numberOfOrganizations).toEqual(3);
      done();
    });
  }, testTimeout);

  test('Test getMetrics no data', (done) => {
    mockHttpClient.responseData = MockMetricsData;
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getMetrics(null).then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test search data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData;
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.search('something').then( r => {
      expect(r.length).toEqual(MockRepositoriesData.length);
      done();
    });
  }, testTimeout);

  test('Test search no data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData;
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.search('something else').then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test findById data', (done) => {
    let id = '0b5a091ecae902be1f8ae33fc0081218';
    mockHttpClient.responseData = MockRepositoriesData.filter(x => x.id == id);
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findById(id).then( r => {
      expect(r.id).toEqual(id);
      done();
    });
  }, testTimeout);

  test('Test findById no data', (done) => {
    let id = '0b5a091ecae902be1f8ae33fc0081218';
    mockHttpClient.responseData = MockRepositoriesData.filter(x => x.id == id);
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findById(id).then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test findByIds data', (done) => {
    mockHttpClient.responseData = [MockRepositoriesData[0],MockRepositoriesData[1]];
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findByIds(['id1','id2']).then( r => {
      expect(r.length).toEqual(2);
      done();
    });
  }, testTimeout);

  test('Test findByIds no data', (done) => {
    mockHttpClient.responseData = [MockRepositoriesData[0],MockRepositoriesData[1]];
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.findByIds(['id1','id2']).then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test postUsedProject data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData[0];
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.postUsedProject({},'id').then( r => {
      expect(r.id).toEqual('0b5a091ecae902be1f8ae33fc0081218');
      done();
    });
  }, testTimeout);

  test('Test postUsedProject no data', (done) => {
    mockHttpClient.responseData = MockRepositoriesData[0];
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.postUsedProject({},'id').then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test registerUserEmail data', (done) => {
    mockHttpClient.responseData = {msg: 'registered'};
    mockHttpClient.responseOk = true;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.registerUserEmail({},'id').then( r => {
      expect(r.result.msg).toEqual('registered');
      done();
    });
  }, testTimeout);

  test('Test registerUserEmail no data', (done) => {
    mockHttpClient.responseData = {msg: 'registered'};
    mockHttpClient.responseOk = false;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.registerUserEmail({},'id').then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test getCategories data', (done) => {
    mockHttpClient.responseData = MockCategoriesData;
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getCategories().then( r => {
      expect(r.length).toEqual(MockCategoriesData.length);
      done();
    });
  }, testTimeout);

  test('Test getCategories no data', (done) => {
    mockHttpClient.responseData = MockCategoriesData;
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getCategories().then( r => {
      expect(r).toBeNull();
      done();
    });
  }, testTimeout);

  test('Test getEngagementPopups data', (done) => {
    mockHttpClient.responseData = [{id:'id1'},{id:'id2'}];
    mockHttpClient.responseCode = 200;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getEngagementPopups().then( r => {
      expect(r.length).toEqual(2);
      done();
    });
  }, testTimeout);

  test('Test getEngagementPopups no data', (done) => {
    mockHttpClient.responseData = [{id:'id1'},{id:'id2'}];
    mockHttpClient.responseCode = 500;
    let dc = new DataContext(mockHttpClient, stageConfig, {});
    dc.getEngagementPopups().then( r => {
      expect(r.length).toEqual(0);
      done();
    });
  }, testTimeout);

});
