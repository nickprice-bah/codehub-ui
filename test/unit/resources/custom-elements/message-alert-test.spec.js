import { MessageAlert } from '../../../../src/resources/custom-elements/message-alert';


describe('Test - custom-elements/message-alert', () => {
  let testTimeout;
  let mockElement;

  beforeEach( () => {
    testTimeout = 3000;
    mockElement = {}
  });

  it('Test instance', (done) => {
    let ma = new MessageAlert(mockElement)
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test dismiss', (done) => {
    let ma = new MessageAlert(mockElement)
    document.querySelector = (a) => { return null;};
    ma.dismiss();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu no titleBarNav', (done) => {
    let ma = new MessageAlert(mockElement)
    document.querySelector = (a) => { return null;};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu no li', (done) => {
    let ma = new MessageAlert(mockElement)
    document.querySelector = (a) => { return {getElementsByTagName: () => {return null;}};};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu found', (done) => {
    let ma = new MessageAlert(mockElement)
    let item = {
      classList:{
        contains:(x)=>{return true;}
      },
      getElementsByTagName: (x) => {return [{focus: () => {return true;}}]}
    };
    document.querySelector = (a) => { return {getElementsByTagName: () => {return [item];}};};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu found no links', (done) => {
    let ma = new MessageAlert(mockElement)
    let item = {
      classList:{
        contains:(x)=>{return true;}
      },
      getElementsByTagName: (x) => {return null}
    };
    document.querySelector = (a) => { return {
        getElementsByTagName: () => {return [item];},
        focus: () => {return true;}
      };
    };
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu found invalid links', (done) => {
    let ma = new MessageAlert(mockElement)
    let item = {
      classList:{
        contains:(x)=>{return true;}
      },
      getElementsByTagName: (x) => {return [null]}
    };
    document.querySelector = (a) => { return {
        getElementsByTagName: () => {return [item];},
        focus: () => {return true;}
      };
    };
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu not found', (done) => {
    let ma = new MessageAlert(mockElement)
    document.querySelector = (a) => {
      if (a == '#searchBar') {
        return null;
      }
      return {
        getElementsByTagName: () => {return [];},
        focus: () => {return true;}
      };
    };
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });


});
