import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogFunctions } from '../resources/shared/dialog-functions';

@inject(Router, DialogFunctions)
export class Repopublishing {
  constructor(router, dialogFunctions) {
    this.router = router;
    this.dialogFunctions = dialogFunctions;
    this.message = 'this is the Source Code Guidelines Page';
    this.currentId= 'ul-jupiter';
    this.id='';
    this.pageLocationId=null;
    this.returnButtonClassName="btn-return-to-text";
    this.params=null;
  }
  activate(params){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.params=params;
  }
  attached(){
    if(this.params){
      let element = document.getElementById(this.params.pathId);
      if(element){
        this.scrollPageWithOffset(element);
      }
    }
  }
  moveToTag(event, endLocationId, startLocationId) {
    this.pageLocationId=startLocationId;
    event.preventDefault();
    let elementEndLocation = document.getElementById(`${endLocationId}`);
    
    if(elementEndLocation) {
      // due to support IE11 where scrollY is not available
      this.scrollPageWithOffset(elementEndLocation);
      let elementEndLocationButton = elementEndLocation.getElementsByClassName("btn-return-to-text");
      elementEndLocationButton[0].classList.add("source-code-button_show");
      elementEndLocation.classList.add("referred-to-thing");
      setTimeout(function(){
        elementEndLocation.classList.remove("referred-to-thing");
      }, 5000);
    }
  }
  scrollPageWithOffset(element){
    let yOff = window.scrollY ? window.scrollY : window.pageYOffset;
    let offset = window.outerHeight * .15;
    const y = element.getBoundingClientRect().top + yOff - offset;
    window.scrollTo(0, y);
  }
  returnToOriginalLocation(endLocationLiId){
    let elementStartText = document.getElementById(this.pageLocationId);
    let elementAEndLocation = document.getElementById(endLocationLiId).getElementsByClassName(this.returnButtonClassName);
    
    this.scrollPageWithOffset(elementStartText);
    elementStartText.classList.add("original-location");
    setTimeout(function(){
      elementStartText.classList.remove("original-location");
    }, 5000);
    this.pageLocationId=null;
    elementAEndLocation[0].classList.remove("source-code-button_show");
  }
}
