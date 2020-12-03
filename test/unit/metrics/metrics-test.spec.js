import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { Filters } from '../../../src/components/filters';
import { DataContext } from '../../../src/services/datacontext';
import { Metrics } from '../../../src/metrics/metrics';
import { StageConfig } from '../../../src/stageConf';
import { DialogFunctions } from '../../../src/resources/shared/dialog-functions';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import MockCategoriesData from '../../mockdata/mock-categories-data.json';
import MockMetricsData from '../../mockdata/mock-metrics-data.json';

export class MockDataContext {
  responseRepositories  = undefined;
  responseCategories = undefined;
  responseMetrics = undefined;

  getRepositories(rq) {return Promise.resolve(this.responseRepositories)}
  getCategories() {return Promise.resolve(this.responseCategories)}
  getMetrics(rq) {return Promise.resolve(this.responseMetrics)}
}

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
}

export class MockDialogFunctions {
  mockRepo = null;
  mockTarget = null;
  openReadmeModal(repo, target) {
    this.mockRepo = repo;
    this.mockTarget = target;
  }
}

describe('Test - metrics : ', () => {

  let testTimeout;
  let mockDataContext;
  let mockRouter;
  let mockDialogFunctions;
  let filters;
  let stageConf;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<Metrics><Metrics>';
    mockDataContext = new MockDataContext();
    mockRouter = new MockRouter();
    mockDialogFunctions = new MockDialogFunctions();
    filters = new Filters();
    stageConf = StageConfig;

    viewModel = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('metrics/metrics')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(DataContext, mockDataContext);
        aurelia.container.registerInstance(Router, mockRouter);
        aurelia.container.registerInstance(Filters, filters);
        aurelia.container.registerInstance(StageConfig, stageConf);
        aurelia.container.registerInstance(DialogFunctions, mockDialogFunctions);
      });

      return comp;
    };

    component = getComponent(viewModel);
    isComponent = true;
  });

  afterEach(() =>{
    if(isComponent) {
      component.dispose();
    }
  });

  test('Test instance of the component', (done) => {
    isComponent = false;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    expect(m).not.toBeNull();
    done();
  }, testTimeout);

  test('Test activate', (done) => {
    isComponent = false;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.activate();
    expect(m.loading).toBeTruthy();
    done();
  }, testTimeout);

  test('Test attached', (done) => {
    isComponent = false;
    mockDataContext.responseRepositories = MockRepositoriesData;
    mockDataContext.responseMetrics = MockMetricsData;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.getChartOptionMostUsedLanguages = () => {return null};
    m.getChartOptionLanguages = () => {return null};
    m.getChartOptionForks = () => {return null};
    m.getChartOptionHealth = () => {return null};
    m.chartMostUsedLanguages = {};
    m.mulChart = {};
    m.mfChart = {};
    m.myChart2 = {};
    m.handleResize = () => {return true;};
    m.attached();
    setTimeout(() => {
      expect(m.projects.length).toEqual(MockRepositoriesData.length);
      done();
    }, 200);
  }, testTimeout);

  test('Test deactivate', (done) => {
    isComponent = false;
    mockDataContext.responseRepositories = MockRepositoriesData;
    mockDataContext.responseMetrics = MockMetricsData;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.handleResize = () => {return true;};
    m.deactivate();
    setTimeout(() => {
      expect(m).not.toBeNull();
      done();
    }, 200);
  }, testTimeout);

  test('Test getData All', (done) => {
    isComponent = false;
    mockDataContext.responseRepositories = MockRepositoriesData;
    mockDataContext.responseMetrics = MockMetricsData;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.getChartOptionMostUsedLanguages = () => {return null};
    m.getChartOptionLanguages = () => {return null};
    m.getChartOptionForks = () => {return null};
    m.getChartOptionHealth = () => {return null};
    m.chartMostUsedLanguages = {};
    m.mulChart = {};
    m.mfChart = {};
    m.myChart2 = {};
    m.handleResize = () => {return true;};
    m.getData('All');
    setTimeout(() => {
      expect(m.projects.length).toEqual(MockRepositoriesData.length);
      done();
    }, 200);
  }, testTimeout);

  test('Test getData by Organization', (done) => {
    isComponent = false;
    let org = 'Trihydro';
    mockDataContext.responseRepositories = MockRepositoriesData.filter(x => x.sourceData.owner.name == org);
    mockDataContext.responseMetrics = MockMetricsData;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.getChartOptionMostUsedLanguages = () => {return null};
    m.getChartOptionLanguages = () => {return null};
    m.getChartOptionForks = () => {return null};
    m.getChartOptionHealth = () => {return null};
    m.chartMostUsedLanguages = {};
    m.mulChart = {};
    m.mfChart = {};
    m.myChart2 = {};
    m.handleResize = () => {return true;};
    m.selectedOrganization = {name: org};
    m.getData();
    setTimeout(() => {
      expect(m.projects.length).toEqual(2);
      done();
    }, 200);
  }, testTimeout);

  test('Test sortProjects', (done) => {
    isComponent = false;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.sortProjects(MockRepositoriesData).then( sortedProjects => {
      expect(sortedProjects[0].id).toEqual('aad4fab6d8f5f8339af37800baa41c25');
      done();
    });
  }, testTimeout);

  test('Test sortProjects null forks case a', (done) => {
    isComponent = false;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    let repos = MockRepositoriesData;
    repos[0].sourceData.forks = null;
    m.sortProjects(repos).then( sortedProjects => {
      expect(sortedProjects[0].id).toEqual('aad4fab6d8f5f8339af37800baa41c25');
      done();
    });
  }, testTimeout);

  test('Test sortProjects null forks case b', (done) => {
    isComponent = false;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    let repos = [...MockRepositoriesData];
    repos[1].sourceData.forks = null;
    m.sortProjects(repos).then( sortedProjects => {
      expect(sortedProjects[0].id).toEqual('aad4fab6d8f5f8339af37800baa41c25');
      done();
    });
  }, testTimeout);

  test('Test sortProjects null forks case b', (done) => {
    isComponent = false;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    let repos = [...MockRepositoriesData];
    repos[1].sourceData.forks = null;
    m.sortProjects(repos).then( sortedProjects => {
      expect(sortedProjects[0].id).toEqual('aad4fab6d8f5f8339af37800baa41c25');
      done();
    });
  }, testTimeout);

  test('Test organizationChanged All', (done) => {
    isComponent = false;
    mockDataContext.responseRepositories = MockRepositoriesData;
    mockDataContext.responseMetrics = MockMetricsData;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.getChartOptionMostUsedLanguages = () => {return null};
    m.getChartOptionLanguages = () => {return null};
    m.getChartOptionForks = () => {return null};
    m.getChartOptionHealth = () => {return null};
    m.chartMostUsedLanguages = {};
    m.mulChart = {};
    m.mfChart = {};
    m.myChart2 = {};
    m.handleResize = () => {return true;};
    let selectedOrganization = {id:0, name:'All'};
    m.organizationChanged(selectedOrganization);
    setTimeout(() => {
      expect(m.projects.length).toEqual(MockRepositoriesData.length);
      done();
    }, 200);
  }, testTimeout);

  test('Test getData by Organization', (done) => {
    isComponent = false;
    let org = 'Trihydro';
    mockDataContext.responseRepositories = MockRepositoriesData.filter(x => x.sourceData.owner.name == org);
    mockDataContext.responseMetrics = MockMetricsData;
    let m = new Metrics(mockDataContext, mockRouter, mockDialogFunctions, stageConf, filters);
    m.getChartOptionMostUsedLanguages = () => {return null};
    m.getChartOptionLanguages = () => {return null};
    m.getChartOptionForks = () => {return null};
    m.getChartOptionHealth = () => {return null};
    m.chartMostUsedLanguages = {};
    m.mulChart = {};
    m.mfChart = {};
    m.myChart2 = {};
    m.handleResize = () => {return true;};
    m.selectedOrganization = {id:1, name:org};
    m.organizationChanged(m.selectedOrganization);
    setTimeout(() => {
      expect(m.projects.length).toEqual(2);
      done();
    }, 200);
  }, testTimeout);

});
