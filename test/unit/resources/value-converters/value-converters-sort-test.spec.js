import { SortValueConverter } from '../../../../src/resources/value-converters/sort';

describe('Test - Value Converters - SortValueConverter', () => {

  it('SortValueConverter : null', (done) => {
    let data = null;
    let config = null;
    let sort = new SortValueConverter();
    let val = sort.toView(data, config);
    expect(val).toBeNull();
    done();
  });

  it('SortValueConverter : default ascending', (done) => {
    let data = [1,2,3,4,5];
    let config = {
      propertyName: 'default',
      direction: 'ascending'
    };
    let sort = new SortValueConverter();
    let val = sort.toView(data, config);
    expect(val).toEqual([5,4,3,2,1]);
    done();
  });

  it('SortValueConverter : default no direction', (done) => {
    let data = [1,2,3,4,5];
    let config = {
      propertyName: 'default',
      direction: 'none'
    };
    let sort = new SortValueConverter();
    let val = sort.toView(data, config);
    expect(val).toEqual(data);
    done();
  });

  it('SortValueConverter : no default, direction ascending', (done) => {
    let data = [
      {val: 3},
      {val: 2},
      {val: 1}
    ];
    let config = {
      propertyName: 'val',
      direction: 'ascending'
    };
    let sort = new SortValueConverter();
    let val = sort.toView(data, config);

    let exp = [
      {val: 1},
      {val: 2},
      {val: 3}
    ];
    expect(val).toEqual(exp);
    done();
  });

  it('SortValueConverter : no default, direction descending', (done) => {
    let data = [
      {val: 1},
      {val: 2},
      {val: 3}
    ];
    let config = {
      propertyName: 'val',
      direction: ''
    };
    let sort = new SortValueConverter();
    let val = sort.toView(data, config);

    let exp = [
      {val: 3},
      {val: 2},
      {val: 1}
    ];
    expect(val).toEqual(exp);
    done();
  });

});
