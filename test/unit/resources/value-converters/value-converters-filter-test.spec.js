import { FilterValueConverter } from '../../../../src/resources/value-converters/filter';

describe('Test - Value Converters - FilterValueConverter', () => {

  it('FilterValueConverter : null', (done) => {
    let fil = new FilterValueConverter();
    let val = fil.toView(null);
    expect(val).toBeNull();
    done();
  });

  it('FilterValueConverter : config null', (done) => {
    let data = [1,2];
    let conf = null;
    let fil = new FilterValueConverter();
    let val = fil.toView(data, conf);
    expect(val).toEqual(data);
    done();
  });

  it('FilterValueConverter : No matching', (done) => {
    let data = [{dat1: 1},{dat2: 2}];
    let conf = {filterArray:['dat3'],propertyName:'dat3'};
    let fil = new FilterValueConverter();
    let val = fil.toView(data, conf);
    expect(val).toEqual([]);
    done();
  });

  it('FilterValueConverter : Matching None', (done) => {
    let data = [{dat: 1, res: 1},{dat: 2, res: 2},{dat: 3, res: 3}];
    let conf = {propertyName: 'dat', filterArray:[5]};
    let fil = new FilterValueConverter();
    let val = fil.toView(data, conf);
    expect(val).toEqual([]);
    done();
  });

  it('FilterValueConverter : Matching 1', (done) => {
    let data = [{dat: 1, res: 1},{dat: 2, res: 2},{dat: 3, res: 3}];
    let conf = {propertyName: 'dat', filterArray:[3]};
    let fil = new FilterValueConverter();
    let val = fil.toView(data, conf);
    expect(val).toEqual([{dat: 3, res: 3}]);
    done();
  });

  it('FilterValueConverter : Matching 2 multi-filter array', (done) => {
    let data = [{dat: 1, res: 1},{dat: 2, res: 2},{dat: 3, res: 3}];
    let conf = {propertyName: 'dat', filterArray:[1,3]};
    let fil = new FilterValueConverter();
    let val = fil.toView(data, conf);
    expect(val).toEqual([{dat: 1, res: 1},{dat: 3, res: 3}]);
    done();
  });

});
