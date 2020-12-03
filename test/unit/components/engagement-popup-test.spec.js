import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { EngagementPopup } from '../../../src/components/engagement-popup';
import { LS_CODEHUB_ENGAGEMENT_POPUP } from '../../../src/constants/ch-constants';

describe('Test - engagement-popup : ', () => {
  let component;
  let viewCompose;
  let modelData;
  let getComponent;
  let testTimeout;
  let isComponent;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<engagement-popup></engagement-popup>';

    getComponent = () => {
      let comp = StageComponent
      .withResources('components/engagement-popup')
      .inView(viewCompose);
      return comp;
    };

    component = getComponent(modelData);

    isComponent = true;
  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      expect(component.viewModel.isVisible).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test getUserSelection true', (done) => {
    isComponent = false;
    let element = {};
    let eventAggregator = {};
    let engagementPopup = new EngagementPopup(element, eventAggregator);
    window.localStorage.getItem = (x) => { return null; }
    let r = engagementPopup.getUserSelection(null);
    expect(r).toBeTruthy();
    done();
  }, testTimeout);

  test('Test getUserSelection data.id', (done) => {
    isComponent = false;
    let element = {};
    let eventAggregator = {};
    let engagementPopup = new EngagementPopup(element, eventAggregator);
    window.localStorage.setItem(LS_CODEHUB_ENGAGEMENT_POPUP, 9);
    let r = engagementPopup.getUserSelection({id:10});
    expect(r).toBeTruthy();
    done();
  }, testTimeout);


  //// Requires investigation since the test is running ok locally by not in the CI/CD pipeline
  // test('Test close', (done) => {
  //   isComponent = false;
  //   let element = {};
  //   let eventAggregator = {};
  //   let engagementPopup = new EngagementPopup(element, eventAggregator);
  //   engagementPopup.close();
  //   setTimeout(() => {
  //     expect(engagementPopup.isClosed).toBeTruthy();
  //     expect(engagementPopup.isVisible).toBeFalsy();
  //     done();
  //   }, 600);
  // }, testTimeout);

  test('Test noShowClicked', (done) => {
    isComponent = false;
    let element = {};
    let eventAggregator = {};
    let engagementPopup = new EngagementPopup(element, eventAggregator);
    engagementPopup.noShowChecked = false;
    engagementPopup.data = { id: 10 };
    engagementPopup.noShowClicked(null);
    let r = window.localStorage.getItem(LS_CODEHUB_ENGAGEMENT_POPUP);
    expect(r).toEqual(engagementPopup.data.id+'');
    done();
  }, testTimeout);

  afterEach( () => {
    if(isComponent) {
      component.dispose();
    }
  });

});
