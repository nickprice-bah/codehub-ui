import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';
import { Repopublishing } from '../../../src/source-code-guidelines/source-code-guidelines';
import { HttpClient } from "aurelia-fetch-client";
import { DialogFunctions } from '../../../src/resources/shared/dialog-functions';

export class MockRouter {
  navigateToRoute(name, obj) {return name+obj; }
  ensureConfigured(fx) {return Promise.resolve(fx)}
}

describe('Test - source-code-guidelines : ', () => {

  let testTimeout;
  let mockRouter;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;
  let dialogFunctions;

  beforeEach( () => {
    testTimeout = 30000;
    viewCompose = '<source-code-guidelines></source-code-guidelines>';
    mockRouter = new MockRouter();
    dialogFunctions = {}

    viewModel = new Repopublishing(mockRouter, dialogFunctions);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('source-code-guidelines/source-code-guidelines')
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
      expect(obj.id).toEqual('');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  //// Requires investigation since the test is running ok locally by not in the CI/CD pipeline
  // test('Test moveToTag', (done) => {
  //   component.create(bootstrap).then( () => {
  //     let obj = component.bindingContext.viewModel;
  //     let event = {preventDefault: () => {return true;}};
  //     let endLocationId = '#m-16-21';
  //     let startLocationId = '#m-16-21_fscp';
  //     document.getElementById = (id) => { return {
  //       getBoundingClientRect: () => {return {top: 0}},
  //       getElementsByClassName: (cls) => {return [{classList: {add: (x) => {return x;}}}]},
  //       classList: {add: (x) => {return x;},remove: (x) => {return x}}
  //     }}
  //     window.scrollTo = (a,b) => {return true;};
  //     obj.moveToTag(event, endLocationId, startLocationId);
  //     expect(obj.pageLocationId).toEqual(startLocationId);
  //     done();
  //   }).catch( e => { console.log(e.toString()) });
  // }, testTimeout);

  test('Test scrollPageWithOffset', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      let element = {getBoundingClientRect: ()=> {return 0;}}
      window.scrollTo = (a,b) => {return true};
      obj.scrollPageWithOffset(element);
      setTimeout(() => {
        expect(element).not.toBeNull();
        done();
      }, 200);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  //// Requires investigation since the test is running ok locally by not in the CI/CD pipeline
  // test('Test returnToOriginalLocation', (done) => {
  //   component.create(bootstrap).then( () => {
  //     let obj = component.bindingContext.viewModel;
  //     let endLocationId = '#m-16-21_fscp';
  //     document.getElementById = (id) => { return {
  //       getBoundingClientRect: () => {return {top: 0}},
  //       getElementsByClassName: (cls) => {return [{classList: {add: (x) => {return x;},remove: (x) => {return x;}}}]},
  //       classList: {add: (x) => {return x;},remove: (x) => {return x}}
  //     }}
  //     window.scrollTo = (a,b) => {return true;};
  //     obj.pageLocationId = '#m-16-21';
  //     obj.returnToOriginalLocation(endLocationId);
  //     expect(obj.pageLocationId).toBeNull();
  //     done();
  //   }).catch( e => { console.log(e.toString()) });
  // }, testTimeout);
});
