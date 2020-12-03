import { UniqueValueConverter } from '../../../../src/resources/value-converters/unique';

describe('Test - Value Converters - UniqueValueConverter', () => {

  it('UniqueValueConverter : null', (done) => {
    let data = null;
    let config = null;
    let unique = new UniqueValueConverter();
    let val = unique.toView(data, config);
    expect(val).toEqual([]);
    done();
  });

  it('UniqueValueConverter : 3 uniques', (done) => {
    let data = [
      {a: 1},
      {b: 2},
      {a: 3},
      {a: 4},
      {b: 5},
    ];
    let config = {
      propertyName: 'a'
    }
    let unique = new UniqueValueConverter();
    let val = unique.toView(data, config);
    expect(val).toEqual([1,'None',3,4]);
    done();
  });

  it('UniqueValueConverter : not None', (done) => {
    let data = [
      {a: 1},
      {a: 2},
      {a: 1},
      {a: 1},
      {a: 2},
    ];
    let config = {
      propertyName: 'a'
    }
    let unique = new UniqueValueConverter();
    let val = unique.toView(data, config);
    expect(val).toEqual([1,2]);
    done();
  });

});
