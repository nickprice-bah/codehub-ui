import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import MockCategoriesData from '../../mockdata/mock-categories-data.json';


describe('Test - Card Category : ', () => {

  let component;
  let mockCategoriesData;
  let viewCompose;
  let modelData;
  let getComponent;

  beforeEach( () => {
    viewCompose = '<compose view-model="components/card-category" model.bind="cateData"></compose>';
    modelData = MockCategoriesData[0];

    getComponent = (modelData) => {
      let component = StageComponent.withResources('components/card-category')
      .inView(viewCompose)
      .boundTo({cateData: modelData});
      component.bootstrap( aurelia => {
        aurelia.use.standardConfiguration();
      });
      return component;
    };

    component = getComponent(modelData);

  });

  it('Expect name to be the title', (done) => {
    component.create(bootstrap).then( () => {
      const element = document.querySelector('.card-category_title');
      expect(MockCategoriesData[0].name).toEqual(element.innerHTML);
      done();
    }).catch( e => { console.log(e.toString()) });
  });

});
