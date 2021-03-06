import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { AgoValueConverter } from '../../src/resources/value-converters/ago';
import { NumValueConverter } from '../../src/resources/value-converters/num';
import { NO_DESCRIPTION_MESSAGE } from '../../src/constants/ch-constants';


describe('Test - Card : ', () => {

  let component;
  let mockRepositoriesData;
  let viewCompose;
  let modelData;
  let getComponent;

  beforeEach( () => {
    jasmine.getFixtures().fixturesPath='base/test/mockdata/';
    mockRepositoriesData = JSON.parse(readFixtures('mock-repositories-data.json'));
    viewCompose = '<compose view-model="components/card" model.bind="repoData"></compose>';
    modelData = { data: mockRepositoriesData[0], showFeatured: false, showMetrics: false};

    getComponent = (modelData) => {
      let component = StageComponent.withResources('components/card')
      .inView(viewCompose)
      .boundTo({repoData: modelData});
      return component;
    };

    component = getComponent(modelData);

    component.bootstrap( aurelia => {
      aurelia.use.standardConfiguration();
    });

  });

  it('Expect title card link text to be project name', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-title-link-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(mockRepositoriesData[0].sourceData.name);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect title card link title to be project name', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-title-link-${mockRepositoriesData[0].id}`);
      const text = `Project name: ${mockRepositoriesData[0].sourceData.name}`;
      expect(element.getAttribute('aria-label')).toEqual(text);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect language name', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector('.org-name');
      expect(element.innerHTML).toEqual(mockRepositoriesData[0].sourceData.language);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project description', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector('.proj-desc');
      expect(element.innerText).toEqual(mockRepositoriesData[0].sourceData.description ? mockRepositoriesData[0].sourceData.description : NO_DESCRIPTION_MESSAGE);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect organization link', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-organization-link-${mockRepositoriesData[0].id}`);
      expect(element.getAttribute('click.trigger')).toEqual('dialogFunctions.openLeavingSiteConfirmation(repo.sourceData.owner.name,repo.sourceData.owner.url,$event.target)');
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect organization link title to be "View on Gitbub"', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-organization-link-${mockRepositoriesData[0].id}`);
      const text = `Project organization: ${mockRepositoriesData[0].sourceData.owner.name}, view on GitHub.`;
      expect(element.getAttribute('aria-label')).toEqual(text);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect organization text to be the organization name', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-organization-link-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(mockRepositoriesData[0].sourceData.owner.name);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect organization updated days', (done) => {
    component.create(bootstrap).then( () => {
      let ago = new AgoValueConverter();
      const element = document.querySelector(`#card-popular-organization-updated-text-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual('Updated '+ago.toView(mockRepositoriesData[0].sourceData.lastPush));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project status link url', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-project-status-link-${mockRepositoriesData[0].id}`);
      expect(element.getAttribute('click.trigger')).toEqual('dialogFunctions.openLeavingSiteConfirmation(repo.sourceData.name,repo.sourceData.repositoryUrl,$event.target)');
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of stars', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-stars-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(num.toView(mockRepositoriesData[0].sourceData.stars));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of contributors', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-contributors-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(num.toView(mockRepositoriesData[0].sourceData.contributors.length));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of watchers', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-watchers-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(num.toView(mockRepositoriesData[0].sourceData.watchers));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of commits', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-commits-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(num.toView(mockRepositoriesData[0].sourceData.commits, 1));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of releases', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-releases-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(''+num.toView(mockRepositoriesData[0].sourceData.releases.length));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of forks', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-forks-${mockRepositoriesData[0].id}`);
      expect(element.innerHTML).toEqual(''+num.toView(mockRepositoriesData[0].sourceData.forks.length));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project number of dowloads', (done) => {
    modelData.showMetrics = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-project-downloads-${mockRepositoriesData[0].id}`);
      let downloads = 0;
      mockRepositoriesData[0].sourceData.releases.forEach( e => downloads += e.total_downloads);
      expect(element.innerHTML).toEqual(''+num.toView(downloads));
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect project readme click trigger', (done) => {
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const id = `#card-popular-project-open-readme-${mockRepositoriesData[0].id}`;
      const element = document.querySelector(id);
      expect(element.getAttribute('click.trigger')).toEqual('dialogFunctions.openReadmeModal(repo,$event.target)');
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect card link to use project-details route passing repo id', (done) => {
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector('.card-link');
      expect(element.getAttribute('route-href')).toEqual('route:project-details; params.bind: {id:repo.id}');
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect card to have label: Metrics...', (done) => {
    component.create(bootstrap).then( () => {
      let num = new NumValueConverter();
      const element = document.querySelector(`#card-popular-metrics-${mockRepositoriesData[0].id}`);
      expect('Metrics...').toEqual(element.innerText);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  it('Expect card to have Featured Ribbon', (done) => {
    modelData.showFeatured = true;
    modelData.data.codehubData.badges.isFeatured = true;
    component = getComponent(modelData);
    component.create(bootstrap).then( () => {
      const element = document.querySelector(`#card-popular-featured-ribbon-${mockRepositoriesData[0].id}`);
      expect('Featured').toEqual(element.innerText);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

  afterEach( () => {
    component.dispose();
  });

});
