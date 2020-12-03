import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import { HttpClient } from "aurelia-fetch-client";
import { Card } from '../../../src/components/card-health';

export class MockDialogFunctions {
  mockRepo = null;
  mockTarget = null;
  openReadmeModal(repo, target) {
    this.mockRepo = repo;
    this.mockTarget = target;
  }
}


describe('Test - card-health : ', () => {

  let dialogFunctions;
  let component;
  let viewCompose;
  let modelData;
  let getComponent;
  let testTimeout;
  let isComponent;

  beforeEach( () => {
    testTimeout = 3000;
    dialogFunctions = new MockDialogFunctions();
    viewCompose = '<compose view-model="components/card-health" model.bind="repoData"></compose>';
    modelData = MockRepositoriesData[0];

    getComponent = (modelData) => {
      let comp = StageComponent.withResources('components/card-health')
      .inView(viewCompose)
      .boundTo({repoData: modelData});
      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerInstance(HttpClient);
      });
      return comp;
    };

    component = getComponent(modelData);
    isComponent = true;
  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-health-title-link-${MockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(MockRepositoriesData[0].sourceData.name);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status active', (done) => {
    modelData.codehubData.badges.status = 'active';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/active_flame_final_28w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status inactive', (done) => {
    modelData.codehubData.badges.status = 'inactive';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/inactive_zzz_final_32w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status inactive', (done) => {
    modelData.codehubData.badges.status = 'pending';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/pending_review_final_29w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status ready-only', (done) => {
    modelData.codehubData.badges.status = 'read-only';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/lock_final_28w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status default', (done) => {
    modelData.codehubData.badges.status = 'something else';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/pending_review_final_29w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test invalid language image', (done) => {
    modelData.sourceData.language = '';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.language_image).toEqual('/img/language-icons/default.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  afterEach( () => {
    if(isComponent) {
      component.dispose();
    }
  });

});
