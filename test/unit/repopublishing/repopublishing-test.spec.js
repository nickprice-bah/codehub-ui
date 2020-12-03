import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { Repopublishing } from '../../../src/repopublishing/repopublishing';
import { DialogFunctions } from '../../../src/resources/shared/dialog-functions';

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

describe('Test - repopublishing/repopublishing : ', () => {

  let testTimeout;
  let mockDialogFunctions;
  let mockRouter;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<repopublishing></repopublishing>';
    mockDialogFunctions = new MockDialogFunctions();
    mockRouter = new MockRouter();

    viewModel = new Repopublishing(mockRouter, mockDialogFunctions);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('repopublishing/repopublishing')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(DialogFunctions, mockDialogFunctions);
        aurelia.container.registerInstance(Router, mockRouter);
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
      expect(obj.router).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate();
      expect(document.body.scrollTop).toEqual(0);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

});
