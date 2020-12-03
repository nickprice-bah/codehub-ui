import { SkipValueConverter } from '../../../../src/resources/value-converters/skip';

describe('Test - Value Converters - SkipValueConverter', () => {

  it('SkipValueConverter : null', (done) => {
    let data = null;
    let count = null;
    let skip = new SkipValueConverter();
    let val = skip.toView(data, count);
    expect(val).toEqual([]);
    done();
  });

  it('SkipValueConverter : negative count', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = -3;
    let skip = new SkipValueConverter();
    let val = skip.toView(data, count);
    expect(val).toEqual([]);
    done();
  });

  it('SkipValueConverter : skip 3', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = 3;
    let skip = new SkipValueConverter();
    let val = skip.toView(data, count);
    expect(val).toEqual([4,5,6,7,8,9,0]);
    done();
  });

  it('SkipValueConverter : skip equal or greater', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = 15;
    let skip = new SkipValueConverter();
    let val = skip.toView(data, count);
    expect(val).toEqual([]);
    done();
  });


});
