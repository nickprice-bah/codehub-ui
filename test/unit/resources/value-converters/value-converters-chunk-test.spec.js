import { ChunkValueConverter } from '../../../../src/resources/value-converters/chunk';

describe('Test - Value Converters - ChunkValueConverter', () => {

  it('ChunkValueConverter : null', (done) => {
    let chunk = new ChunkValueConverter();
    let val = chunk.toView(null);
    expect(val.length).toEqual(0);
    done();
  });

  it('ChunkValueConverter : size null', (done) => {
    let data = [1,2,3];
    let chunk = new ChunkValueConverter();
    let val = chunk.toView(data, null);
    expect(val).toEqual([[1],[2],[3]]);
    done();
  });

  it('ChunkValueConverter : size 3', (done) => {
    let data = [1,2,3,4,5,6,7,8,9];
    let chunk = new ChunkValueConverter();
    let val = chunk.toView(data, 3);
    expect(val).toEqual([[1,2,3],[4,5,6],[7,8,9]]);
    done();
  });

  it('ChunkValueConverter : size 3 with data 5', (done) => {
    let data = [1,2,3,4,5];
    let chunk = new ChunkValueConverter();
    let val = chunk.toView(data, 3);
    expect(val).toEqual([[1,2,3],[4,5,null]]);
    done();
  });
});
