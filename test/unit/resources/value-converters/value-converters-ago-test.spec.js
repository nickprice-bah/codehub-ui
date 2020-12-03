import moment from 'moment';
import { AgoValueConverter } from '../../../../src/resources/value-converters/ago';

describe('Test - Value Converters - AgoValueConverter', () => {

  it('AgoValueConverter : null', (done) => {
    let ago = new AgoValueConverter();
    let val = ago.toView(null);
    expect(val).toEqual('Invalid date');
    done();
  });

  it('AgoValueConverter : seconds', (done) => {
    let dt = moment();
    dt = dt.subtract(30, 'seconds');

    let ago = new AgoValueConverter();
    let val = ago.toView(dt.toDate());
    expect(val).toEqual('a few seconds ago');
    done();
  });

  it('AgoValueConverter : minutes', (done) => {
    let dt = moment();
    dt = dt.subtract(15, 'minutes');

    let ago = new AgoValueConverter();
    let val = ago.toView(dt.toDate());
    expect(val).toEqual('15 minutes ago');
    done();
  });

  it('AgoValueConverter : hours', (done) => {
    let dt = moment();
    dt = dt.subtract(5, 'hours');

    let ago = new AgoValueConverter();
    let val = ago.toView(dt.toDate());
    expect(val).toEqual('5 hours ago');
    done();
  });

  it('AgoValueConverter : days', (done) => {
    let dt = moment();
    dt = dt.subtract(3, 'days');

    let ago = new AgoValueConverter();
    let val = ago.toView(dt.toDate());
    expect(val).toEqual('3 days ago');
    done();
  });

  it('AgoValueConverter : months', (done) => {
    let dt = moment();
    dt = dt.subtract(90, 'days');

    let ago = new AgoValueConverter();
    let val = ago.toView(dt.toDate());
    expect(val).toEqual('3 months ago');
    done();
  });

  it('AgoValueConverter : years', (done) => {
    let dt = moment();
    dt = dt.subtract(2, 'years');

    let ago = new AgoValueConverter();
    let val = ago.toView(dt.toDate());
    expect(val).toEqual('2 years ago');
    done();
  });

});
