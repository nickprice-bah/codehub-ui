import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { ChDropdown } from '../../../src/components/ch-dropdown';


describe('Test - ch-dropdown : ', () => {

  let component;
  let viewCompose;
  let modelData;
  let getComponent;
  let testTimeout;
  let isComponent;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<ch-dropdown id="filterCategories" collection.bind="categoriesFilter" title="Categories" onitemchanged.call="categoriesChanged($event)" />';
    modelData = {
      categories: ['one','two','three']
    }

    getComponent = (modelData) => {
      let comp = StageComponent
      .withResources('components/ch-dropdown')
      .inView(viewCompose)
      .boundTo({categoriesFilter: modelData.categories});
      return comp;
    };

    component = getComponent(modelData);
    isComponent = true;
  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      expect(component.viewModel.id).toEqual('id');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test pickerChanged', (done) => {
    isComponent = false;
    let test = 'test';
    let chDropdown = new ChDropdown();
    chDropdown.pickerChanged(test);
    expect(chDropdown.picker).toEqual(test);
    done();
  }, testTimeout);

  test('Test headerChanged', (done) => {
    isComponent = false;
    let test = 'test';
    let chDropdown = new ChDropdown();
    chDropdown.headerChanged(test);
    expect(chDropdown.options.header).toEqual(test);
    done();
  }, testTimeout);

  test('Test onchangeChanged', (done) => {
    isComponent = false;
    let test = 'test';
    let chDropdown = new ChDropdown();
    chDropdown.onchangeChanged(test);
    expect(chDropdown.onChange).toEqual(test);
    done();
  }, testTimeout);

  test('Test idChanged', (done) => {
    isComponent = false;
    let test = 'test';
    let chDropdown = new ChDropdown();
    chDropdown.idChanged(test);
    expect(chDropdown.id).toEqual(test);
    done();
  }, testTimeout);

  test('Test selectedItemsChanged', (done) => {
    isComponent = false;
    let test = 'test';
    let chDropdown = new ChDropdown();
    let r = '';
    chDropdown.onitemchanged = (x) => { r = x; }
    chDropdown.selectedItemsChanged(test);
    expect(r).toEqual(test);
    done();
  }, testTimeout);

  test('Test selectedValuesChanged', (done) => {
    isComponent = false;
    let test = 'test';
    let chDropdown = new ChDropdown();
    let r = '';
    chDropdown.onvaluechanged = (x) => { r = x; }
    chDropdown.selectedValuesChanged(test);
    expect(r).toEqual(test);
    done();
  }, testTimeout);

  test('Test deselectAll was called', (done) => {
    isComponent = false;
    let test = 'test';
    let r = '';
    let chDropdown = new ChDropdown();
    chDropdown.picker = {};
    chDropdown.picker.deselectAll = () => { r = test; }
    chDropdown.deselectAll();
    expect(r).toEqual(test);
    done();
  }, testTimeout);

  afterEach( () => {
    if(isComponent) {
      component.dispose();
    }
  });

});
