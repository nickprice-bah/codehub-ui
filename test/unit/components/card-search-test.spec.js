import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import MockRepositoriesData from '../../mockdata/mock-repositories-data.json';
import { HttpClient } from "aurelia-fetch-client";

export class MockDialogFunctions {
  mockRepo = null;
  mockTarget = null;
  openReadmeModal(repo, target) {
    this.mockRepo = repo;
    this.mockTarget = target;
  }
}


describe('Test - Card-Search : ', () => {

  let dialogFunctions;
  let component;
  let viewCompose;
  let modelData;
  let getComponent;
  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
    dialogFunctions = new MockDialogFunctions();
    viewCompose = '<compose view-model="components/card-search" model.bind="repoData"></compose>';

    getComponent = (modelData) => {
      let comp = StageComponent.withResources('components/card-search')
      .inView(viewCompose)
      .boundTo({repoData: modelData});
      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerInstance(HttpClient);
      });
      return comp;
    };

    component = getComponent(MockRepositoriesData[0]);

  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-search-title-link-${MockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(MockRepositoriesData[0].sourceData.name);
      done();
    }).catch( e => { console.log(e.toString()); });
  }, testTimeout);

  test('Test infected files', (done) => {
    let infected = 10;
    let modelData = {...MockRepositoriesData[0]};
    modelData.generatedData.vscan.infected_files = infected;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {

      expect(component.viewModel.currentViewModel.infected_files).toEqual(infected);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status active', (done) => {
    let modelData = {...MockRepositoriesData[0]};
    modelData.codehubData.badges.status = 'active';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/active_flame_final_28w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status inactive', (done) => {
    let modelData = {...MockRepositoriesData[0]};
    modelData.codehubData.badges.status = 'inactive';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/inactive_zzz_final_32w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status inactive', (done) => {
    let modelData = {...MockRepositoriesData[0]};
    modelData.codehubData.badges.status = 'pending';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/pending_review_final_29w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status ready-only', (done) => {
    let modelData = {...MockRepositoriesData[0]};
    modelData.codehubData.badges.status = 'read-only';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/lock_final_28w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test status default', (done) => {
    let modelData = {...MockRepositoriesData[0]};
    modelData.codehubData.badges.status = 'something else';
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.badge_status_image).toEqual('/img/pending_review_final_29w_35h.svg');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test dowloads', (done) => {
    let mockRelease = {
      total_downloads: 10
    };
    let modelData = {...MockRepositoriesData[0]};
    modelData.sourceData.releases.push(mockRelease);
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.downloads).toEqual(mockRelease.total_downloads);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test invalid language image', (done) => {
    let modelData = {...MockRepositoriesData[0]};
    modelData.sourceData.language = null;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      expect(component.viewModel.currentViewModel.repo.sourceData.language).toBeNull()
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  afterEach( () => {
    component.dispose();
  });

});
