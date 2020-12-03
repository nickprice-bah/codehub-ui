import { PickValueConverter } from '../../../../src/resources/value-converters/pick';

describe('Test - Value Converters - PickValueConverter', () => {

  it('PickValueConverter : null array', (done) => {
    let pick = new PickValueConverter();
    let val = pick.toView(null);
    expect(val).toEqual([]);
    done();
  });

  it('PickValueConverter : null count', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = null;
    let pick = new PickValueConverter();
    let val = pick.toView(data, count);
    expect(val).toEqual([]);
    done();
  });

  it('PickValueConverter : negative count', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = -2;
    let pick = new PickValueConverter();
    let val = pick.toView(data, count);
    expect(val).toEqual([]);
    done();
  });

  it('PickValueConverter : pick 3', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = 3;
    let pick = new PickValueConverter();
    let val = pick.toView(data, count);
    expect(val).toEqual([1,2,3]);
    done();
  });

  it('PickValueConverter : pick more that available', (done) => {
    let data = [1,2,3,4,5,6,7,8,9,0];
    let count = 30;
    let pick = new PickValueConverter();
    let val = pick.toView(data, count);
    expect(val).toEqual(data);
    done();
  });

});
