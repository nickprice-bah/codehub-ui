import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';
import { DataContext } from 'services/datacontext';
import { StageConfig } from './stageConf';

@inject(DataContext, Router, EventAggregator, StageConfig)
export class NavBar {

  constructor(dataContext, router, eventAggregator, stageConfig) {
    this.dataContext = dataContext;
    this.router = router;
    this.eventAggregator = eventAggregator;
    this.stageConfig = stageConfig;

    this.PF_AUTH_GIVENNAME = this.PF_AUTH_GIVENNAME !== '' ? this.PF_AUTH_GIVENNAME : 'Guest'; // eslint-disable-line
    this.PF_AUTH_GIVENNAME = this.PF_AUTH_GIVENNAME === '<!--#echo var="PF_AUTH_GIVENNAME" -->' ? 'Guest' : this.PF_AUTH_GIVENNAME; // in case that the SSI variables are not set

    this.navSearchText = '';
  }
//submit.delegate="executeNavSearch(navSearchText)"
  executeNavSearch(searchText) {
    this.eventAggregator.publish('searchExecuted', searchText);
    this.router.navigateToRoute('results', { searchText });
    this.hideNavSearch();
  }

  hideNavSearch() {
    $('#searchBtn').removeClass('hidden');
    $('#titleBarNav').removeClass('hidden');
    $('#searchForm').addClass('hidden');
    $('#searchBtn').parent().removeClass('hidden');
  }

  attached() {
    $('#searchBtn').on('click', event => {
      $('#searchBtn').parent().addClass('hidden');
      $('#titleBarNav').addClass('hidden');
      $('#searchForm').removeClass('hidden');
      $('#searchForm input').focus();
      this.navSearchText = '';
    });

    $('#searchForm input').focusout(event => {
      this.hideNavSearch();
      $('#searchBtn').focus();
    });

    $('#searchForm input').keydown(event => {
      if(event.key === 'Escape'){
        this.hideNavSearch();
        $('#searchBtn').focus();
      }
    });

    /*eslint-disable */
    var pxScrolled = 25;
    var duration = 500;

    $(window).scroll(function() {
      if ($(this).scrollTop() > pxScrolled) {
        $('.navbar').addClass('sticky-header');
        //$('.fab-back-top').removeClass('hidden');
        $('.fab-container').css({'bottom': '0px', 'transition': '.05s'});
      } else {
        $('.navbar').removeClass('sticky-header');
        //$('.fab-back-top').addClass('hidden');
        $('.fab-container').css({'bottom': '-72px'});
      }
    });

    $('#backToTop').click(function(e) {
      e.preventDefault();
      $('body').animate({scrollTop: 0}, duration);
    });
    /*eslint-enable */
    $('#gov-banner-button').on('click', event =>{
      $('#gov-banner').toggleClass("display-none");
    });
    // let element = this.document.getElementById("gov-banner-button");
    // console.log("here");
    // if(element){
    //   element.addEventListener("click", toggleClass(element));
    //   console.log("here 1");
    // }
  }

  is_resources_subpage(name) {
    let sub_pages = ['source-code-guidelines', 'repopublishing','faqs','additional-information','badges-about','metrics'];
    return sub_pages.includes(name);
  }

}
