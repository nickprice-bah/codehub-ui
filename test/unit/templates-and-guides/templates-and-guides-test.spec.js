import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { Repopublishing } from '../../../src/templates-and-guides/templates-and-guides';
import { HttpClient } from "aurelia-fetch-client";
import { DialogFunctions } from '../../../src/resources/shared/dialog-functions';

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
  ensureConfigured(fx) {return Promise.resolve(fx)}
}

describe('Test - templates-and-guides : ', () => {

  let testTimeout;
  let mockRouter;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;
  let dialogFunctions;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<templates-and-guides></templates-and-guides>';
    mockRouter = new MockRouter();
    dialogFunctions = {}

    viewModel = new Repopublishing(mockRouter, dialogFunctions);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('templates-and-guides/templates-and-guides')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(HttpClient);
        aurelia.container.registerInstance(Router, mockRouter);
        aurelia.container.registerInstance(DialogFunctions, dialogFunctions);
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
      obj.activate();
      expect(obj.message).toEqual('this is the Templates and Guides Page');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);
});
