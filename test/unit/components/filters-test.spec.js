import { Filters } from '../../../src/components/filters';


describe('Test - filters : ', () => {
  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
  });

  test('Test instance ', (done) => {
    let filters = new Filters();
    expect(filters.selectedLanguages.length).toEqual(0);
    done();
  }, testTimeout);

  test('Test getNested', (done) => {
    let filters = new Filters();
    let r = filters.getNested({data:{id:10}}, 'data.id')
    expect(r).toEqual(10);
    done();
  }, testTimeout);

  test('Test getUniqueValues', (done) => {
    let filters = new Filters();
    let array = [{data:{id:10}},{data:{id:20}},{data:{key:10}}];
    let r = filters.getUniqueValues(array,'data.id');
    expect(r.length).toEqual(3);
    done();
  }, testTimeout);

  test('Test toggleOrg', (done) => {
    let filters = new Filters();
    let event = {target:{checked: true}};
    let projects = [{sourceData:{owner:{name: 'p1'}}},{sourceData:{owner:{name: 'p2'}}}];
    filters.toggleOrg(event, projects);
    expect(filters.selectedOrganizations.length).toEqual(projects.length);
    done();
  }, testTimeout);

  test('Test toggleLang', (done) => {
    let filters = new Filters();
    let event = {target:{checked: true}};
    let languages = [{sourceData:{language:'l1'}},{sourceData:{language:'l2'}}];
    filters.toggleLang(event, languages);
    expect(filters.selectedLanguages.length).toEqual(languages.length);
    done();
  }, testTimeout);

  test('Test countProjectsInCategory', (done) => {
    let filters = new Filters();
    let categoryId = 1;
    let projects = [{codehubData:{categories:[1,2]}},{codehubData:{categories:[3,4]}}];
    let r = filters.countProjectsInCategory(projects, categoryId);
    expect(r).toEqual(1);
    done();
  }, testTimeout);

  test('Test countUniqueValues', (done) => {
    let filters = new Filters();
    let languages = [{sourceData:{language:'l1'}},{sourceData:{language:'l2'}},{sourceData:{language:'l1'}},{sourceData:{lang:'l3'}}];
    let r = filters.countUniqueValues(languages, 'sourceData.language', 'l1');
    expect(r).toEqual(2);
    done();
  }, testTimeout);

  test('Test countUniqueValues None', (done) => {
    let filters = new Filters();
    let languages = [{sourceData:{lang:'l1'}},{sourceData:{lang:'l3'}}];
    let r = filters.countUniqueValues(languages, 'sourceData.language', 'None');
    expect(r).toEqual(2);
    done();
  }, testTimeout);

  test('Test filterArray', (done) => {
    let filters = new Filters();
    let languages = [{sourceData:{lang:'l1'}},{sourceData:{lang:'l1'}},{sourceData:{lang:'l3'}}];
    let r = filters.filterArray(languages, ['l3'], 'sourceData.lang');
    expect(r.length).toEqual(1);
    done();
  }, testTimeout);

  test('Test filterArray no filter', (done) => {
    let filters = new Filters();
    let languages = [{sourceData:{lang:'l1'}},{sourceData:{lang:'l1'}},{sourceData:{lang:'l3'}}];
    let r = filters.filterArray(languages, [], 'sourceData.lang');
    expect(r.length).toEqual(languages.length);
    done();
  }, testTimeout);

  test('Test filterArray value None', (done) => {
    let filters = new Filters();
    let languages = [{sourceData:{lang:'l1'}},{sourceData:{lang:'l1'}},{sourceData:{lang:'l3'}}];
    let r = filters.filterArray(languages, ['None'], 'sourceData.lan');
    expect(r.length).toEqual(languages.length);
    done();
  }, testTimeout);

  test('Test filterArrayCategories', (done) => {
    let filters = new Filters();
    let selectedCategories = ['3|three'];
    let projects = [{codehubData:{categories:['1','2']}},{codehubData:{categories:['3','4']}}];
    let r = filters.filterArrayCategories(projects, selectedCategories);
    expect(r.length).toEqual(selectedCategories.length);
    done();
  }, testTimeout);

  test('Test filterArrayCategories no SelectedCategories', (done) => {
    let filters = new Filters();
    let selectedCategories = [];
    let projects = [{codehubData:{categories:['1','2']}},{codehubData:{categories:['3','4']}}];
    let r = filters.filterArrayCategories(projects, selectedCategories);
    expect(r.length).toEqual(projects.length);
    done();
  }, testTimeout);

  test('Test getDataFromPipedString null', (done) => {
    let filters = new Filters();
    let r = filters.getDataFromPipedString(null, 0);
    expect(r).toBeNull();
    done();
  }, testTimeout);

  test('Test getDataFromPipedString index out of range', (done) => {
    let filters = new Filters();
    let r = filters.getDataFromPipedString('1|one', 2);
    expect(r).toBeNull();
    done();
  }, testTimeout);

  test('Test buildFilterCategories', (done) => {
    let filters = new Filters();
    let categories = [{id: '1', name:'one'},{id: '2', name:'two'},{id: '5', name:'five'}];
    let projects = [{codehubData:{categories:['1','3']}},{codehubData:{categories:['2','4']}}];
    let r = filters.buildFilterCategories(categories, projects);
    expect(r.length).toEqual(2);
    done();
  }, testTimeout);

  test('Test buildFilterOrganizations', (done) => {
    let filters = new Filters();
    let projects = [{sourceData:{owner:{name: 'org1'}}},{sourceData:{owner:{name: 'org2'}}}];
    let r = filters.buildFilterOrganizations(projects);
    expect(r.length).toEqual(2);
    done();
  }, testTimeout);

  test('Test buildFilterLanguages', (done) => {
    let filters = new Filters();
    let projects = [{sourceData:{language:'l1'}},{sourceData:{language:'l2'}}];
    let r = filters.buildFilterLanguages(projects);
    expect(r.length).toEqual(2);
    done();
  }, testTimeout);

  test('Test clearAllFilters', (done) => {
    let filters = new Filters();
    filters.clearAllFilters();
    expect(filters.selectedCategories.length).toEqual(0);
    done();
  }, testTimeout);

});
