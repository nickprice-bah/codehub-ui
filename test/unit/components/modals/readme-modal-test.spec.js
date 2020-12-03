import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DialogController, DialogService } from 'aurelia-dialog';
import { TaskQueue } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ReadmeModal } from '../../../../src/components/modals/readme-modal';
import MockRepositoriesData from '../../../mockdata/mock-repositories-data.json';

export class MockController {
  okResponse = false;
  cancelCalled = false;
  settings = {
    centerHorizontalOnly: true,
    lock: false
  }
  ok() { this.okResponse = true; }
  cancel() { this.cancelCalled = true; }
}

export class MockDialogService {
  response  = undefined;
  open = function(obj) {
    return {
      whenClosed: function(fx){return Promise.resolve(fx())}
    }
  };
}

export class MockTaskQueue {
  response = undefined;
  queueMicroTask(fx) {return Promise.resolve(fx())}
}

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
}

describe('Test - leaving-modal : ', () => {

  let testTimeout;
  let mockController;
  let mockDialogService;
  let mockRouter;
  let mockTaskQueue;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<readme-modal></readme-modal>';
    mockController = new MockController();
    mockRouter = new MockRouter();
    mockTaskQueue = new MockTaskQueue();
    mockDialogService = new MockDialogService();
    viewModel = new ReadmeModal(mockController, mockRouter, mockTaskQueue, mockDialogService);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/modals/readme-modal')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerInstance(DialogController, mockController);
        aurelia.container.registerInstance(DialogService, mockDialogService);
        aurelia.container.registerInstance(TaskQueue, mockTaskQueue);
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
    viewModel.repo = MockRepositoriesData[0];
    component = getComponent(viewModel);
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0], {});
      expect(obj.controller).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test navigateAndClose', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0], {});
      obj.navigateAndClose();
      expect(obj.controller.okResponse).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test openLeavingSiteConfirmation', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0], {});
      let target = {
        getAttribute: function(id){ return null; }
      }
      obj.dialogService.response = {};
      obj.openLeavingSiteConfirmation('name', 'url',target);
      setTimeout(() => {
        expect(obj.visible).toBeTruthy();
        done();
      }, 300);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test prependUrlForImages', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0], {});
      let r = obj.prependUrlForImages(obj.repo, 'img-url');
      expect(r).toEqual(`${MockRepositoriesData[0].sourceData.repositoryUrl}/raw/${MockRepositoriesData[0].sourceData.defaultBranch}/img-url`);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test attached', (done) => {
    viewModel.repo = MockRepositoriesData[0];
    component = getComponent(viewModel);
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0], {});
      obj.attached();
      expect(obj.controller).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

});
