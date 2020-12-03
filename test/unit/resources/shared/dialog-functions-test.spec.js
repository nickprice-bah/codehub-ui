import { DialogFunctions } from '../../../../src/resources/shared/dialog-functions';
import MockRepositoriesData from '../../../mockdata/mock-repositories-data.json';

export class MockDialogService {
  response  = undefined;
  called = undefined
  open = function(obj) {
    return {
      whenClosed: (fx) => {
        this.called = true;
        fx(this.response);
      }
    }
  };
}

export class MockDataContext {
  response  = undefined;

  postUsedProject(data, id) {return Promise.resolve(this.response)}
}

describe('Test - shared/dialog-functions', () => {
  let testTimeout;
  let mockDialogService;
  let mockDataContext;

  beforeEach( () => {
    testTimeout = 3000;
    mockDialogService = new MockDialogService();
    mockDataContext = new MockDataContext();
  });

  it('Test instance', (done) => {
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    expect(df).not.toBeUndefined();
    done();
  });

  it('Test openReadmeModal', (done) => {
    mockDialogService.response = {wasCancelled: true};
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    let repo = MockRepositoriesData[0];
    let target = {getAttribute: (x) => {return x;}}
    document.querySelector = (x) => {return {focus: ()=>{return true}}};
    df.openReadmeModal(repo, target);
    expect(mockDialogService.called).toBeTruthy();
    done();
  });

  it('Test openLeavingSiteConfirmation bypass', (done) => {
    mockDialogService.response = {};
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    let target = {getAttribute: (x) => {return x;}}
    let bypass = true;
    window.open = (a,b) => {return {focus: () => {return true}}};
    document.querySelector = (x) => {return {focus: ()=>{return true}}};
    df.openLeavingSiteConfirmation('name', 'url', target, bypass);
    expect(mockDialogService.called).toBeUndefined();
    done();
  });

  it('Test openLeavingSiteConfirmation no bypass', (done) => {
    mockDialogService.response = {};
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    let target = {getAttribute: (x) => {return x;}}
    let bypass = false;
    document.querySelector = (x) => {return {focus: ()=>{return true}}};
    df.openLeavingSiteConfirmation('name', 'url', target, bypass);
    expect(mockDialogService.called).toBeTruthy();
    done();
  });

  it('Test displayVScanDialog', (done) => {
    mockDialogService.response = {};
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    let target = {getAttribute: (x) => {return x;}}
    let repo = MockRepositoriesData[0]
    document.querySelector = (x) => {return {focus: ()=>{return true}}};
    df.displayVScanDialog(repo, target);
    expect(mockDialogService.called).toBeTruthy();
    done();
  });

  it('Test openAddProjectModal', (done) => {
    mockDialogService.response = {wasCancelled: true, output: {}};
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    let target = {getAttribute: (x) => {return x;}}
    let repo = MockRepositoriesData[0]
    df.projectsThatUseUs = [];
    document.querySelector = (x) => {return {focus: ()=>{return true}}};
    df.openAddProjectModal(repo, target);
    expect(mockDialogService.called).toBeTruthy();
    done();
  });

  it('Test openContribModal', (done) => {
    mockDialogService.response = {};
    let df = new DialogFunctions(mockDialogService, mockDataContext);
    let target = {getAttribute: (x) => {return x;}}
    let repo = MockRepositoriesData[0]
    document.querySelector = (x) => {return {focus: ()=>{return true}}};
    df.openContribModal(repo, target);
    expect(mockDialogService.called).toBeTruthy();
    done();
  });

});
