import { inject, bindable } from 'aurelia-framework';
import { DataContext } from '../../services/datacontext';

@inject(Element, DataContext)
export class Footer {
  @bindable active;
  constructor(element, dataContext) {
    this.element = element;
    this.valid = true;
    this.confirmed = false;
    this.email = '';
    this.timer = null;
    this.words = ['Code', 'Insight', 'Engagement'];
    this.word_index = null;
    this.word = this.words[this.word_index];
    this.msseconds = 4500;
    this.dataContext = dataContext;
    this.message = 'Stay up to date on new features and repositories!';
    this.message_alert = 'There is a problem with the registration service, please try again later.';
    this.message_invalid_email = 'Invalid email format, please try again.';
    this.message_confirmation = 'Thanks for signing up to stay in touch with ITS CodeHub!';
    this.is_error = false;
    this.version = this.prepareVersion(process.env.APP_VERSION);
    this.showVersion = false;
  }

  attached() {
    this.timer_timeout();
  }

  close() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    $(this.element).hide();
    this.focusActiveMenu();
  }

  signup() {
    if (this.validate_email()) {
      this.dataContext.registerUserEmail(this.email).then(resp => {
        if (resp && (resp.code === 200 || resp.code === 201)) {
          this.email = 'Email address submitted!';
          this.confirmed = true;
        } else {
          this.is_error = true;
          this.confirmed = false;
        }
      });
    } else {
      this.valid = false;
      this.confirmed = false;
      this.email = '';
      this.focus_input();
    }
  }

  focus_input() {
    let elem = document.querySelector('#input-email-address');
      if (elem) {
        elem.focus();
      }
  }

  validate_email() {
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(this.email);
  }

  focusActiveMenu() {
    const titleBarNav = document.querySelector('#titleBarNav');
    if(!titleBarNav)
      return;
    let items = titleBarNav.getElementsByTagName('li');
    if(!items)
      return;

    let found = false;
    for(let item of items) { //search for the active page to focus
      if(item.classList.contains('active')) {
        let links = item.getElementsByTagName('a');
        if(!links)
          continue;
        let a = links[0];
        if(!a)
          return;
        a.focus();
        found = true;
        break;
      }
    }
    if(!found) { //seach for the search bar to focus
      const searchBarElement = document.querySelector('#searchBar');
      if(searchBarElement) {
        found = true;
        searchBarElement.focus();
      }
    }
    if(!found) { //search for project name in project details
      const projectDetailsProjectName = document.querySelector('#project-details-project-name');
      if(projectDetailsProjectName) {
        projectDetailsProjectName.focus();
      }
    }
  }

  timer_timeout() {
    $('#keyword').fadeOut(500, () => {
      this.word_index ++;
      if (!this.word_index || (this.word_index >= this.words.length)) {
        this.word_index = 0;
      }
      this.word = this.words[this.word_index];
      $('#keyword').fadeIn(500);

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout( () => {
        this.timer_timeout();
      }, this.msseconds);
    });

  }

  handleKeypress(event) {
    if (event && event.key==='Enter') {
      this.signup();
    } else {
      if (!this.valid) {
        this.valid = true;
      }
      if (this.is_error) {
        this.is_error = false;
      }
    }
    return true;
  }

  prepareVersion(ver) {
    let parts = ver.split('.')
    let version = `${parts[0]}.${parts[1]}`
    let build = `${parts[2]}`
    return {version, build};
  }

  displayVersion(event) {
    if (event && event.altKey) {
      this.showVersion = true;
      setTimeout(()=>{
        this.showVersion = false;
      },3000);
    }
  }
}