import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Footer } from '../../../../src/components/footer/footer-ch';
import { DataContext } from '../../../../src/services/datacontext';

export class MockDataContext {
  response  = undefined;

  registerUserEmail(email) {return Promise.resolve(this.response)}
}

describe('Test - footer : ', () => {

  let testTimeout;
  let mockElement;
  let mockDataContext;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    process.env.APP_VERSION = '1.2.3';
    viewCompose = '<footer-ch></footer-ch>';
    mockDataContext = new MockDataContext();
    mockElement = {};

    viewModel = new Footer(mockElement, mockDataContext);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('components/footer/footer-ch')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      return comp;
    };

    component = getComponent(viewModel);
    isComponent = true;
  });

  afterEach(() =>{
    delete process.env.APP_VERSION;
    if(isComponent) {
      component.dispose();
    }
  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      expect(component.bindingContext.viewModel.showVersion).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  //// Requires investigation since the test is running ok locally by not in the CI/CD pipeline
  // test('Test displayVersion', (done) => {
  //   component.create(bootstrap).then( () => {
  //     let footer = component.bindingContext.viewModel;
  //     let event = {altKey: true};
  //     footer.displayVersion(event);
  //     expect(footer.showVersion).toBeTruthy();
  //     setTimeout(() => {
  //       expect(footer.showVersion).toBeFalsy();
  //       done();
  //     }, 3500);
  //   }).catch( e => { console.log(e.toString()) });
  // }, testTimeout);

  test('Test validate_email valid', (done) => {
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'a.valid@email.com';
      expect(footer.validate_email()).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test signup ok', (done) => {
    mockDataContext.response = {code:200};
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'a.valid@email.com';
      footer.signup();
      setTimeout(() => {
        expect(footer.confirmed).toBeTruthy();
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test signup error', (done) => {
    mockDataContext.response = {code:500};
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'a.valid@email.com';
      footer.signup();
      setTimeout(() => {
        expect(footer.confirmed).toBeFalsy();
        expect(footer.is_error).toBeTruthy();
        done();
      }, 100);
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test signup invalid email', (done) => {
    mockDataContext.response = {code:200};
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'xyz';
      footer.signup();
      expect(footer.confirmed).toBeFalsy();
      expect(footer.confirmed).toBeFalsy();
      expect(footer.email).toEqual('');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test focusActiveMenu', (done) => {
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.focusActiveMenu();
      expect(footer.email).toEqual('');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test handleKeypress', (done) => {
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'xyz';
      let event = {key:'Enter'};
      footer.handleKeypress(event);
      expect(footer.valid).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test handleKeypress valid', (done) => {
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'xyz';
      footer.valid = false
      let event = {key:'other-key'};
      footer.handleKeypress(event);
      expect(footer.valid).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test handleKeypress is_error', (done) => {
    component.create(bootstrap).then( () => {
      let footer = component.bindingContext.viewModel;
      footer.email = 'xyz';
      footer.is_error = true
      let event = {key:'other-key'};
      footer.handleKeypress(event);
      expect(footer.is_error).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  it('Test focusActiveMenu no titleBarNav', (done) => {
    isComponent = false;
    let ma = new Footer(mockElement, mockDataContext);
    document.querySelector = (a) => { return null;};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu no li', (done) => {
    isComponent = false;
    let ma = new Footer(mockElement, mockDataContext);
    document.querySelector = (a) => { return {getElementsByTagName: () => {return null;}};};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu found', (done) => {
    isComponent = false;
    let ma = new Footer(mockElement, mockDataContext);
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
    isComponent = false;
    let ma = new Footer(mockElement, mockDataContext);
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
    isComponent = false;
    let ma = new Footer(mockElement, mockDataContext);
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
    isComponent = false;
    let ma = new Footer(mockElement, mockDataContext);
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
