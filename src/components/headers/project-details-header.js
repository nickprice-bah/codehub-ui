import { inject } from 'aurelia-framework';
import { activationStrategy } from 'aurelia-router';
import { DataContext } from 'services/datacontext';
import { DialogService } from 'aurelia-dialog';
import { LeavingModal } from '../../components/modals/leaving-modal';
import { StageConfig } from '../../stageConf';

@inject(DataContext, DialogService, StageConfig)
export class ProjectDetailsHeader {

  constructor(dataContext, dialogService, stageConfig) {
    this.dataContext = dataContext;
    this.dialogService = dialogService;
    this.stageConfig = stageConfig;

    this.repo = {};
    this.exitDialogLinkId = null

    // TODO Have some sort of loading text or loading animation while dataContext loads
    // this.repo.project_name = 'Loading...';
    // this.repo.language = 'Loading...';
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  activate(params) {
    this.dataContext.findById(params.id).then(repo => {
      this.repo = repo;
    });
  }

  goBack() {
    history.back();
  }

  openLeavingSiteConfirmation(name, url, target) {
    this.exitDialogLinkId = target.getAttribute('id');
    const mdl = { name, url };
    this.dialogService.open({ viewModel: LeavingModal, model: mdl, lock: false }).whenClosed( response => {
      const element = document.querySelector('#'+this.exitDialogLinkId);
      if(element) {
        element.focus();
      }
    });
  }

}
