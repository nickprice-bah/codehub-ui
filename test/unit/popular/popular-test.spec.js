import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Popular } from '../../../src/popular/popular';
import { DataContext } from '../../../src/services/datacontext';
import { StageConfig } from '../../../src/stageConf';
import { FakeData } from '../../../src/fakeData';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import MockCategoriesData from '../../mockdata/mock-categories-data.json';

export class MockDialogFunctions {
  mockRepo = null;
  mockTarget = null;
  openReadmeModal(repo, target) {
    this.mockRepo = repo;
    this.mockTarget = target;
  }
}

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
  ensureConfigured(fx) {return Promise.resolve(fx)}
}

export class MockDataContext {
  responseFeatured  = undefined;
  responseCategories = undefined;
  responseEngagementPopups = undefined;

  findFeatured() {return Promise.resolve(this.responseFeatured)}
  getCategories() {return Promise.resolve(this.responseCategories)}
  getEngagementPopups() {return Promise.resolve(this.responseEngagementPopups)}
}

describe('Test - popular/popular : ', () => {

  let testTimeout;
  let mockDialogFunctions;
  let mockRouter;
  let mockDataContext;
  let mockStageConfig;
  let eventAggregator;
  let fakeData;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<popular></popular>';
    mockDialogFunctions = new MockDialogFunctions();
    mockRouter = new MockRouter();
    mockDataContext = new MockDataContext();
    mockStageConfig = StageConfig;
    eventAggregator = new EventAggregator
    fakeData = FakeData;

    viewModel = new Popular(mockDataContext, mockRouter, mockStageConfig, fakeData, eventAggregator);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('popular/popular')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(DataContext, mockDataContext);
        aurelia.container.registerInstance(Router, mockRouter);
        aurelia.container.registerInstance(StageConfig, mockStageConfig);
        aurelia.container.registerInstance(FakeData, fakeData);
        aurelia.container.registerInstance(EventAggregator, eventAggregator);
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
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      expect(obj).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test getData no Featured', (done) => {
    mockDataContext.responseFeatured = null;
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseEngagementPopups = [{id:'1'},{id:'2'}];
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      let r = obj.getData();
      expect(obj.featured.length).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test getData Featured', (done) => {
    mockDataContext.responseFeatured = [MockRepositoriesData[0],MockRepositoriesData[1]];
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseEngagementPopups = [{id:'1'},{id:'2'}];
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      let r = obj.getData();
      setTimeout(()=> {
        expect(obj.featured.length).toEqual(3);
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test getData empty Featured, no categories and no engagement-popups', (done) => {
    mockDataContext.responseFeatured = [];
    mockDataContext.responseCategories = null;
    mockDataContext.responseEngagementPopups = null;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      let r = obj.getData();
      setTimeout(()=> {
        expect(obj.featured.length).toEqual(1);
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    mockDataContext.responseFeatured = [];
    mockDataContext.responseCategories = null;
    mockDataContext.responseEngagementPopups = null;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate();
      setTimeout(()=> {
        expect(obj.featured.length).toEqual(1);
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

});
