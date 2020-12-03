import { inject, bindable } from 'aurelia-framework';
import { DataContext } from '../../services/datacontext';
import $ from 'jquery';

@inject(Element, DataContext)
export class EmailRegistration {
  @bindable active;
  constructor(element, dataContext) {
    this.element = element;
    this.valid = true;
    this.email = '';
    this.timer = null;
    this.words = ['Code', 'Insight', 'Engagement'];
    this.word_index = null;
    this.word = this.words[this.word_index];
    this.msseconds = 4500;
    this.dataContext = dataContext;
    this.message = 'Join our mailing list! Stay up to date on new features and repositories!';
    this.message_alert = 'There is a problem with the registration service, please try again later.';
    this.message_invalid_email = 'Invalid email format, please try again.';
    this.is_error = false;
  }

  attached() {
    this.focus_input();
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
          $(this.element).hide();
          this.focusActiveMenu();
        } else {
          this.is_error = true;
        }
      });
    } else {
      this.valid = false;
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
}