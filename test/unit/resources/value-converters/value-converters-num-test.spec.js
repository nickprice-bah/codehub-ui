import { NumValueConverter } from '../../../../src/resources/value-converters/num';

describe('Test - Value Converters - NumValueConverter', () => {

  it('NumValueConverter : null', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(null);
    expect(val).toEqual(0);
    done();
  });

  it('NumValueConverter : Decimal no digits', (done) => {
      let num = new NumValueConverter();
      let val = num.toView(0.012345678);
      expect(val).toEqual('0');
      done();
  });

  it('NumValueConverter : Decimal 3 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(0.0123456789, 3);
    expect(val).toEqual('0.012');
    done();
  });

  it('NumValueConverter : Decimal has just zeros', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(10.00, 3);
    expect(val).toEqual('10');
    done();
  });

  it('NumValueConverter : K symbol no digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(6006.0123456789);
    expect(val).toEqual('6K');
    done();
  });

  it('NumValueConverter : K symbol Decimal 5 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(6006.0123456789, 5);
    expect(val).toEqual('6.00601K');
    done();
  });

  it('NumValueConverter : M symbol no digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456.0123456789);
    expect(val).toEqual('9M');
    done();
  });

  it('NumValueConverter : M symbol Decimal 5 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456.0123456789, 5);
    expect(val).toEqual('9.12346M');
    done();
  });

  it('NumValueConverter : G symbol no digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789.0123456789);
    expect(val).toEqual('9G');
    done();
  });

  it('NumValueConverter : G symbol Decimal 5 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789.0123456789, 5);
    expect(val).toEqual('9.12346G');
    done();
  });

  it('NumValueConverter : T symbol no digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789012.0123456789);
    expect(val).toEqual('9T');
    done();
  });

  it('NumValueConverter : T symbol Decimal 5 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789012.0123456789, 5);
    expect(val).toEqual('9.12346T');
    done();
  });

  it('NumValueConverter : P symbol no digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789012345.0123456789);
    expect(val).toEqual('9P');
    done();
  });

  it('NumValueConverter : P symbol Decimal 5 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789012345.0123456789, 5);
    expect(val).toEqual('9.12346P');
    done();
  });

  it('NumValueConverter : E symbol no digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789012345678.0123456789);
    expect(val).toEqual('9E');
    done();
  });

  it('NumValueConverter : E symbol Decimal 5 digits', (done) => {
    let num = new NumValueConverter();
    let val = num.toView(9123456789012345678.0123456789, 5);
    expect(val).toEqual('9.12346E');
    done();
  });

});
