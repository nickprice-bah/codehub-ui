import { inject, TaskQueue, computedFrom } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { LeavingModal } from './leaving-modal';
import { NO_README_MESSAGE } from '../../constants/ch-constants';

@inject(DialogController, Router, TaskQueue, DialogService)
export class ReadmeModal {
  constructor(controller, router, taskQueue, dialogService) {
    this.controller = controller;
    // this.controller.settings.centerHorizontalOnly = true;
    this.controller.settings.lock = false;
    this.repo = null;
    this.router = router;
    this.taskQueue = taskQueue;
    this.dialogService = dialogService;
    this.exitDialogLinkId = null;
    this.visible = true;
  }

  activate(repo, navigationInstruction) {
    this.repo = repo;
  }

  attached() {
    const self = this;
    this.taskQueue.queueMicroTask(() => {
      const readmeObj = document.querySelector('#readme-content');
      const anchors = readmeObj.getElementsByTagName('a');
      const imgs = readmeObj.getElementsByTagName('img');
      for (let i = 0; i < anchors.length; i++) {
        anchors[i].onclick = function na(event) {
          if (event.target.tagName.toLowerCase() === 'a') {
            if (event.target.href.includes(document.location.origin)) {
              const ts = event.target.href.substring(document.location.origin.length + 1);
              if (ts[0] === '#') {
                return true;
              }
            } else {
              self.openLeavingSiteConfirmation(event.target.innerHTML, event.target.href, event.target);
            }
          }
          return false;
        };
      }

      for (let j = 0; j < imgs.length; j++){
        if(imgs[j].getAttribute("src").indexOf("http")){
          const fully_qualified_url = this.prependUrlForImages(this.repo, imgs[j].getAttribute("src"));
          imgs[j].setAttribute("src", fully_qualified_url);
        }
      }
      const readmeTitle = document.querySelector('#readme-title');
      readmeTitle.focus();
    });
  }

  @computedFrom('repo.content')
  get content() {
    let c = this.repo && this.repo.sourceData && this.repo.sourceData.readme && this.repo.sourceData.readme.content ? this.repo.sourceData.readme.content : NO_README_MESSAGE;
    return c;
  }
  get hascontent() {
    return this.repo && this.repo.sourceData && this.repo.sourceData.readme && this.repo.sourceData.readme.content ? true : false;
  }

navigateAndClose() {
    this.router.navigateToRoute('project-details', { id: this.repo.id });
    this.controller.ok();
  }

  openLeavingSiteConfirmation(name, url, target) {
    this.visible = false;
    this.exitDialogLinkId = target.getAttribute('id') ? target.getAttribute('id') : 'no-id-detected';
    const mdl = { name, url };
    this.dialogService.open({ viewModel: LeavingModal, model: mdl, lock: false }).whenClosed( response => {
      this.visible = true;
      setTimeout(() => {
        const element = document.querySelector('#'+this.exitDialogLinkId);
        if(element) {
          element.focus();
        } else {
          const readmeTitle = document.querySelector('#readme-title');
          readmeTitle.focus();
        }
      },200);
    });
  }
  prependUrlForImages(repo, readmeImgUrl){
    return(repo.sourceData.repositoryUrl + "/raw/" + repo.sourceData.defaultBranch + "/" + readmeImgUrl);
  }
}
