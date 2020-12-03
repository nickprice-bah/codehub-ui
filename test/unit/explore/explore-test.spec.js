import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import {PLATFORM} from 'aurelia-pal';
import { Router } from 'aurelia-router';
import { Filters } from '../../../src/components/filters';
import { DataContext } from '../../../src/services/datacontext';
import { Explore } from '../../../src/explore/explore';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import MockCategoriesData from '../../mockdata/mock-categories-data.json';

export class MockDataContext {
  responseRepositories  = undefined;
  responseCategories = undefined;

  getRepositories(rq) {return Promise.resolve(this.responseRepositories)}
  getCategories() {return Promise.resolve(this.responseCategories)}
}

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
}

describe('Test - explore : ', () => {

  let testTimeout;
  let mockDataContext;
  let mockRouter;
  let filters;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<explore></explore>';
    mockDataContext = new MockDataContext();
    mockRouter = new MockRouter();
    filters = new Filters();

    viewModel = new Explore(mockDataContext, mockRouter, filters);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('explore/explore')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(Router, mockRouter);
        aurelia.container.registerInstance(DataContext, mockDataContext);
        aurelia.container.registerInstance(Filters, filters);
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
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseRepositories = MockRepositoriesData;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      expect(obj.projectTitle).toEqual('Explore');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test getData', (done) => {
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseRepositories = MockRepositoriesData;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.getData();
      setTimeout(() => {
        expect(obj.resultCount).toEqual(MockRepositoriesData.length);
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test getData null projects', (done) => {
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseRepositories = null;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.getData();
      setTimeout(() => {
        expect(obj.searchDone).toBeTruthy();
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseRepositories = MockRepositoriesData;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(null);
      setTimeout(() => {
        expect(obj.searchDone).toBeTruthy();
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test manageParams', (done) => {
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseRepositories = MockRepositoriesData;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.params = {category: '1|Self Driving Car'};
      document.querySelector = () => {return {au:{controller:{viewModel:{picker:{methods:{val:function(id){return true;}}}}}}}};
      obj.manageParams();
      expect(obj.params).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test applyFilters', (done) => {
    mockDataContext.responseCategories = MockCategoriesData;
    mockDataContext.responseRepositories = MockRepositoriesData;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      obj.applyFilters();
      expect(obj.resultCount).toEqual(MockRepositoriesData.length);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test categoriesChanged', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = [{ id:1, option:'Vehicle Traffic Control'}];
      obj.categoriesChanged(val);
      expect(obj.resultCount).toEqual(2);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test categoriesChanged empty val', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = [];
      obj.categoriesChanged(val);
      expect(obj.filterCategoriesEmpty).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test categoriesChanged null val', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = null;
      obj.categoriesChanged(val);
      expect(obj.resultCount).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test organizationsChanged null val', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = null;
      obj.organizationsChanged(val);
      expect(obj.resultCount).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test organizationsChanged', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = [{ option:'Trihydro'}];
      obj.organizationsChanged(val);
      expect(obj.resultCount).toEqual(2);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test organizationsChanged empty val', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = [];
      obj.organizationsChanged(val);
      expect(obj.resultCount).toEqual(MockRepositoriesData.length);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test languagesChanged null val', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = null;
      obj.languagesChanged(val);
      expect(obj.resultCount).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test languagesChanged', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = [{option:'Java'}];
      obj.languagesChanged(val);
      expect(obj.resultCount).toEqual(2);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test languagesChanged empty val', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.projects = MockRepositoriesData;
      let val = [];
      obj.languagesChanged(val);
      expect(obj.resultCount).toEqual(MockRepositoriesData.length);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);
});
