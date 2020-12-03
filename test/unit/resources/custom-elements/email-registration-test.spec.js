import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DataContext } from '../../../../src/services/datacontext';
import { EmailRegistration } from '../../../../src/resources/custom-elements/email-registration';

export class MockDataContext {
  response  = undefined;

  registerUserEmail(rq) {return Promise.resolve(this.response)}
}

describe('Test - custom-elements/email-registration : ', () => {

  let testTimeout;
  let mockDataContext;
  let mockElement;
  let component;
  let viewCompose;
  let getComponent;
  let isComponent;
  let viewModel;

  beforeEach( () => {
    testTimeout = 3000;
    viewCompose = '<email-registration></email-registration>';
    mockDataContext = new MockDataContext();
    mockElement = {};

    viewModel = new EmailRegistration(mockElement, mockDataContext);
    getComponent = (vm) => {
      let comp = StageComponent
      .withResources('resources/custom-elements/email-registration')
      .inView(viewCompose)
      .boundTo({viewModel: vm});

      comp.bootstrap( aurelia => {
        aurelia.use.standardConfiguration()
        aurelia.container.registerInstance(DataContext, mockDataContext);
        aurelia.container.registerInstance(Element, mockElement);
      });

      return comp;
    };

    component = getComponent(viewModel);
    isComponent = true;
  });

  afterEach(() =>{
    if(isComponent) {
      component.dispose();
    }
  });

  test('Test instance of the component', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      expect(obj.valid).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test signup invalid email', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.validate_email = () => {return false;};
      obj.signup();
      expect(obj.valid).toBeFalsy();
      expect(obj.email).toEqual('');
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test signup valid email ok', (done) => {
    mockDataContext.response = {code: 200}
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.validate_email = () => {return true;};
      obj.signup();
      expect(obj.is_error).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test signup valid email error', (done) => {
    mockDataContext.response = null;
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.validate_email = () => {return true;};
      obj.signup();
      expect(obj.is_error).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test focus_input', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      document.querySelector = (x) => {return {focus: ()=> {return true;}}}
      obj.focus_input();
      expect(obj).not.toBeNull();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test validate_email true', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.email = 'unit@test.com';
      let r = obj.validate_email();
      expect(r).toBeTruthy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  test('Test validate_email false', (done) => {
    component.create(bootstrap).then( () => {
      let obj = component.bindingContext.viewModel;
      obj.email = 'xyz';
      let r = obj.validate_email();
      expect(r).toBeFalsy();
      done();
    }).catch( e => { console.log(e.toString()) });
  }, testTimeout);

  it('Test focusActiveMenu no titleBarNav', (done) => {
    isComponent = false;
    let ma = new EmailRegistration(mockElement, mockDataContext);
    document.querySelector = (a) => { return null;};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu no li', (done) => {
    isComponent = false;
    let ma = new EmailRegistration(mockElement, mockDataContext);
    document.querySelector = (a) => { return {getElementsByTagName: () => {return null;}};};
    ma.focusActiveMenu();
    expect(ma).not.toBeUndefined();
    done();
  });

  it('Test focusActiveMenu found', (done) => {
    isComponent = false;
    let ma = new EmailRegistration(mockElement, mockDataContext);
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
    let ma = new EmailRegistration(mockElement, mockDataContext);
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
    let ma = new EmailRegistration(mockElement, mockDataContext);
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
    let ma = new EmailRegistration(mockElement, mockDataContext);
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

  it('Test handleKeypress Enter', (done) => {
    isComponent = false;
    let ma = new EmailRegistration(mockElement, mockDataContext);
    let event = {key: 'Enter'};
    let r = ma.handleKeypress(event);
    expect(r).toBeTruthy();
    done();
  });

  it('Test handleKeypress not valid', (done) => {
    isComponent = false;
    let ma = new EmailRegistration(mockElement, mockDataContext);
    ma.valid = false;
    let event = {key: ''};
    let r = ma.handleKeypress(event);
    expect(ma.valid).toBeTruthy();
    done();
  });

  it('Test handleKeypress is_error', (done) => {
    isComponent = false;
    let ma = new EmailRegistration(mockElement, mockDataContext);
    ma.is_error = true;
    let event = {key: ''};
    let r = ma.handleKeypress(event);
    expect(ma.is_error).toBeFalsy();
    done();
  });

});
