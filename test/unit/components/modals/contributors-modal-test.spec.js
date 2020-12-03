import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DialogController, DialogService } from 'aurelia-dialog';
import { ContributorsModal } from '../../../../src/components/modals/contributors-modal';
import MockRepositoriesData from '../../../mockdata/mock-repositories-data.json';

export class MockDialogService {
  response  = undefined;
  open = function(obj) {
    return {
      whenClosed: function(fx){return Promise.resolve(fx())}
    }
  };
}

export class MockController {
  okResponse = undefined;
  settings = {
    centerHorizontalOnly: true,
    lock: false
  }
  ok(data) { return okResponse;}
}

describe('Test - contributors-modal : ', () => {

  let testTimeout;
  let mockController;
  let mockDialogService;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<contributors-modal></contributors-modal>';
    mockDialogService = new MockDialogService();
    mockController = new MockController();
    viewModel = new ContributorsModal(mockController, mockDialogService);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/modals/contributors-modal')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerInstance(DialogController, mockController);
        aurelia.container.registerInstance(DialogService, mockDialogService);
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
      expect(obj.visible).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0]);
      expect(obj.repo).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  //// Requires investigation since the test is running ok locally by not in the CI/CD pipeline
  // test('Test openLeavingSiteConfirmation', (done) => {
  //   component.create(bootstrap).then( () => {
  //     let obj = component.bindingContext.viewModel;
  //     let target = {
  //       getAttribute: (id) => {return id}
  //     }
  //     obj.dialogService.response = {};
  //     obj.openLeavingSiteConfirmation('name', 'url', target);
  //     setTimeout(() => {
  //       expect(obj.visible).toBeTruthy();
  //       done();
  //     }, 300);
  //   }).catch( e => { console.log(e.toString()) });
  // }, testTimeout);


});
