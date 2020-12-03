import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DialogController } from 'aurelia-dialog';
import { VScanModal } from '../../../../src/components/modals/vscan-modal';
import MockRepositoriesData from '../../../mockdata/mock-repositories-data.json';

export class MockController {
  okResponse = undefined;
  cancelResponse = false;
  settings = {
    centerHorizontalOnly: true,
    lock: false
  }
  ok(data) { return okResponse;}
  cancel() { this.cancelResponse = true; }
}

describe('Test - vscan-modal : ', () => {

  let testTimeout;
  let mockController;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<vscan-modal></vscan-modal>';
    mockController = new MockController();
    viewModel = new VScanModal(mockController);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/modals/vscan-modal')
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
      obj.activate(MockRepositoriesData[0]);
      expect(obj.isFocus).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test attached', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0]);
      document.querySelector = (id) => { return {focus: ()=> {return true;}}};
      obj.attached();
      expect(obj.isFocus).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test navigateAndClose', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.activate(MockRepositoriesData[0]);
      document.querySelector = (id) => { return {focus: ()=> {return true;}}};
      obj.navigateAndClose();
      expect(obj.controller.cancelResponse).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);


});
