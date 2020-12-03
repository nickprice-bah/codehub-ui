import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { AddProjectsModal } from '../../../../src/components/modals/addprojects-modal';
import MockRepositoriesData from '../../../mockdata/mock-repositories-data.json';

export class MockDataContext {
  response  = undefined;

  getRepositories(ids) {return Promise.resolve(this.response)}
}

export class MockController {
  okResponse = undefined;
  settings = {
    centerHorizontalOnly: true,
    lock: false
  }
  ok(data) { return okResponse;}
}

describe('Test - addprojects-modal : ', () => {

  let testTimeout;
  let mockController;
  let mockDataContext;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<addprojects-modal></addprojects-modal>';
    mockDataContext = new MockDataContext();
    mockController = new MockController();

    viewModel = new AddProjectsModal(mockController, mockDataContext);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/modals/addprojects-modal')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

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
      expect(obj.hasFocus).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

});
