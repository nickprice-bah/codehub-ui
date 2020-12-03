import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { Faqs } from '../../../src/faqs/faqs';
import { HttpClient } from "aurelia-fetch-client";

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
  ensureConfigured(fx) {return Promise.resolve(fx)}
}

describe('Test - faqs : ', () => {

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
    viewCompose = '<faqs></faqs>';
    mockRouter = new MockRouter();

    viewModel = new Faqs(mockRouter, {});
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('faqs/faqs')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(HttpClient);
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
      expect(obj.message).toEqual('this is the FAQs Page');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);
});
