import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import {EventAggregator} from 'aurelia-event-aggregator';
import { PopularCategories } from '../../../src/components/popular-categories';
import { ES_MSG_CATEGORIES_DATA } from '../../../src/constants/ch-constants';

describe('Test - popular-categories : ', () => {
  let component;
  let viewCompose;
  let modelData;
  let getComponent;
  let testTimeout;
  let isComponent;
  let eventAggregator;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<popular-categories caption="Popular Categories" />';
    eventAggregator = new EventAggregator();

    getComponent = () => {
      let comp = StageComponent
      .withResources('components/popular-categories')
      .inView(viewCompose);

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerInstance(EventAggregator, eventAggregator);
      });
      return comp;
    };

    component = getComponent(modelData);

    isComponent = true;
  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      expect(component.viewModel.caption).toEqual('Popular Categories');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test eventAggregator', (done) => {
    component.create(bootstrap).then( () => {
      let data = [{name: 'cat1', isPopular: true, orderPopular: 1}, {name: 'cat2', isPopular: true, orderPopular: 1}]
      eventAggregator.publish(ES_MSG_CATEGORIES_DATA, data);
      expect(component.viewModel.categories.length).toEqual(2);
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  afterEach( () => {
    if(isComponent) {
      component.dispose();
    }
  });

});
