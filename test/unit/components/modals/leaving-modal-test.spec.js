import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DialogController } from 'aurelia-dialog';
import { LeavingModal } from '../../../../src/components/modals/leaving-modal';

export class MockController {
  okResponse = undefined;
  cancelCalled = false;
  settings = {
    centerHorizontalOnly: true,
    lock: false
  }
  ok(data) { return okResponse;}
  cancel() { this.cancelCalled = true; }
}

describe('Test - leaving-modal : ', () => {

  let testTimeout;
  let mockController;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<leaving-modal></leaving-modal>';
    mockController = new MockController();
    viewModel = new LeavingModal(mockController);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/modals/leaving-modal')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerInstance(DialogController, mockController);
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
      expect(obj.controller).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test activate', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate({url:'url'}, {});
      expect(obj.model.url).toEqual('url');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test navigateAndClose', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.model = {url:'url'};
      window.open = function(a, b){return {focus: function(){return true;}}};
      obj.navigateAndClose();
      expect(obj.controller.cancelCalled).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);
});
