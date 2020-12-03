import { Card } from '../../../src/components/card-feature-fake';
import { CardSearch } from '../../../src/components/card-search';

describe('Test - card-feature-fake : ', () => {

  let testTimeout;

  beforeEach( () => {
    testTimeout = 3000;
  });

  test('Test activate downloads', (done) => {
    let card = new Card();
    card.downloads = 0;
    let modelData = {releases: [{total_downloads: 10}]};
    card.activate(modelData);
    expect(card.downloads).toEqual(10);
    done();
  }, testTimeout);

  test('Test activate invalid releases object', (done) => {
    let card = new Card();
    card.downloads = 0;
    let modelData = {releases: {}};
    card.activate(modelData);
    expect(card.releases.length).toEqual(0);
    done();
  }, testTimeout);

  test('Test showHideMetrics display Hide...', (done) => {
    let card = new Card();
    card.showMetrics = false;
    card.showHideMetrics();
    expect(card.metricsText).toEqual('Hide metrics...');
    done();
  }, testTimeout);

  test('Test showHideMetrics display Metrics...', (done) => {
    let card = new Card();
    card.showMetrics = true;
    card.showHideMetrics();
    expect(card.metricsText).toEqual('Metrics...');
    done();
  }, testTimeout);

});
