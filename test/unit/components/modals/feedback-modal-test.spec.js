import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DialogController } from 'aurelia-dialog';
import { FeedbackModal } from '../../../../src/components/modals/feedback-modal';

export class MockController {
  okResponse = undefined;
  settings = {
    centerHorizontalOnly: true,
    lock: false
  }
  ok(data) { return okResponse;}
}

describe('Test - feedback-modal : ', () => {

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
    viewCompose = '<feedback-modal></feedback-modal>';
    mockController = new MockController();
    viewModel = new FeedbackModal(mockController);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/modals/feedback-modal')
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
});
