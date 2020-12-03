import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import { StageConfig } from '../../../src/stageConf';
import { Filters } from '../../../src/components/filters';
import { DataContext } from '../../../src/services/datacontext';
import { Results } from '../../../src/search/results';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import MockCategoriesData from '../../mockdata/mock-categories-data.json';

export class MockDataContext {
  responseSearch  = undefined;
  responseCategories = undefined;

  search(rq) {return Promise.resolve(this.responseSearch)}
  getCategories() {return Promise.resolve(this.responseCategories)}
}

describe('Test - search/results : ', () => {

  let testTimeout;
  let mockDataContext;
  let eventAggregator;
  let filters;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<results></results>';
    mockDataContext = new MockDataContext();
    filters = new Filters();
    eventAggregator = new EventAggregator();

    viewModel = new Results(mockDataContext, filters, eventAggregator, StageConfig);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('search/results')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(DataContext, mockDataContext);
        aurelia.container.registerInstance(Filters, filters);
        aurelia.container.registerInstance(EventAggregator, eventAggregator);
        aurelia.container.registerInstance(StageConfig);
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
      expect(obj.selectedSort).toEqual('default');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test determineActivationStrategy', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      let r = obj.determineActivationStrategy();
      expect(r).toEqual('replace');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseSearch = MockRepositoriesData;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({searchText: 'something'});
      setTimeout(() => {
        expect(obj.resultCount).toEqual(MockRepositoriesData.length);
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test categoriesChanged null', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.categoriesChanged(null);
      expect(obj.resultCount).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test categoriesChanged', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.categoriesChanged([{id:'1', option:'Self Driving Car'}]);
      expect(obj.filterCategoriesEmpty).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test categoriesChanged empty', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.categoriesChanged([]);
      expect(obj.filterCategoriesEmpty).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test organizationsChanged null', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.organizationsChanged(null);
      expect(obj.resultCount).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test organizationsChanged', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.organizationsChanged([{option:'usdot-jpo-ode'}]);
      expect(obj.filterOrgEmpty).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test organizationsChanged empty', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.organizationsChanged([]);
      expect(obj.filterOrgEmpty).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test languagesChanged null', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.languagesChanged(null);
      expect(obj.resultCount).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test languagesChanged', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.languagesChanged([{option:'usdot-jpo-ode'}]);
      expect(obj.filterLanguageEmpty).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test languagesChanged empty', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.languagesChanged([]);
      expect(obj.filterLanguageEmpty).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

});
