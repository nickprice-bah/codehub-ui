import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { ProjectDetails } from '../../../src/project-details/project-details';
import { DataContext } from '../../../src/services/datacontext';
import { StageConfig } from '../../../src/stageConf';
import { DialogFunctions } from '../../../src/resources/shared/dialog-functions';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';

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
  response  = undefined;

  findById(id) {return Promise.resolve(this.response)}
}

describe('Test - project-details/project-details : ', () => {

  let testTimeout;
  let mockDialogFunctions;
  let mockRouter;
  let mockDataContext;
  let mockStageConfig;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<project-details></project-details>';
    mockDialogFunctions = new MockDialogFunctions();
    mockRouter = new MockRouter();
    mockDataContext = new MockDataContext();
    mockStageConfig = StageConfig;

    viewModel = new ProjectDetails(mockDataContext, mockRouter, mockStageConfig, mockDialogFunctions);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('project-details/project-details')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(DialogFunctions, mockDialogFunctions);
        aurelia.container.registerInstance(Router, mockRouter);
        aurelia.container.registerInstance(DataContext, mockDataContext);
        aurelia.container.registerInstance(StageConfig, mockStageConfig);
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

  test('Test determineActivationStrategy', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      let r = obj.determineActivationStrategy();
      expect(r).toEqual('replace');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.repo.id).toEqual(MockRepositoriesData[0].id);
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate null repo', (done) => {
    mockDataContext.response = null;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(document.body.scrollTop).toEqual(0);
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate downloads', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    mockDataContext.response.sourceData.releases = [{total_downloads: 10}];
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.downloads).toEqual(10);
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate badge status active', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    mockDataContext.response.codehubData.badges.status = 'active';
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.badge_status_image).toEqual('/img/active_flame_final_28w_35h.svg');
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate badge status inactive', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    mockDataContext.response.codehubData.badges.status = 'inactive';
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.badge_status_image).toEqual('/img/inactive_zzz_final_32w_35h.svg');
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate badge status pending', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    mockDataContext.response.codehubData.badges.status = 'pending';
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.badge_status_image).toEqual('/img/pending_review_final_29w_35h.svg');
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate badge status read-only', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    mockDataContext.response.codehubData.badges.status = 'read-only';
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.badge_status_image).toEqual('/img/lock_final_28w_35h.svg');
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate badge status default', (done) => {
    mockDataContext.response = MockRepositoriesData[0];
    mockDataContext.response.codehubData.badges.status = 'something-else';
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({id:MockRepositoriesData[0].id});
      setTimeout(() => {
        expect(obj.badge_status_image).toEqual('/img/pending_review_final_29w_35h.svg');
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test goBack', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.goBack();
      expect(obj).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

});
